const SimpleCat = require("./unit/SimpleCat");
const { SHOP_POSSIBILITIES, GAME_STATES } = require("./constants/CONSTS");
const { sendMsg, addPlayer } = require("./utils");

const IN_QUEUE = 3;

class Player {
    static getNewId() {
        return Math.random().toString(36).substr(2, 6);
    }

    constructor(id, ws) {
        addPlayer(this);

        this.id = id;
        this.ws = ws;
    }

    init() {
        this.level = 3;
        this.exp = -2;
        this.money = 30;
        this.maxExp = 4;
        this.maxHp = 100;
        this.hp = 100;

        this.board = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
        ];
        this.queue = [null, null, null, null, null, null, null];
        this.items = [null, null, null, null, null, null];

        this.winning = 0;
        this.losing = 0;
        this.synergies = {};
    }

    updatePlayer() {
        this.updateHp();
        this.updateExp();
        this.updateLevel();
        this.updateShop();
        this.updateMoney();
        this.updateBoard();
        this.updateQueue();
        this.updateSynergies();
        this.updateWinning();
        this.updateLosing();
        this.updateItems();
    }

    /**
     * @param {number} newMoney
     */
    set _money(newMoney) {
        this.money = parseInt(newMoney);
        this.updateMoney();
    }
    get _money() {
        return this.money;
    }

    set _exp(newExp) {
        if (this.level === SHOP_POSSIBILITIES.length) return;
        this.exp = parseInt(newExp);
        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level++;
            this.maxExp += this.level * 2;
            this.updateLevel();
        }
        this.updateExp();
    }
    get _exp() {
        return this.exp;
    }

    set _winning(newWinning) {
        if (newWinning > this._winning) this._losing = 0;
        this.winning = parseInt(newWinning);
        this.updateWinning();
    }
    get _winning() {
        return this.winning;
    }

    set _losing(newLosing) {
        if (newLosing > this._losing) this._winning = 0;
        this.losing = parseInt(newLosing);
        this.updateLosing();
    }
    get _losing() {
        return this.losing;
    }

    set _shop(newShop) {
        this.shop = newShop;
        this.updateShop();
    }

    buyCat(index) {
        if (!this.shop[index]) return false;
        let catId = this.shop[index].id;
        let catProto = SimpleCat.prototypes[catId];
        if (this.money < catProto.cost) return false;

        for (let i = 0; i < this.queue.length; ++i) {
            if (this.queue[i]) continue;

            this.queue[i] = new SimpleCat(catId, this, i, 3);
            this._money = this.money - catProto.cost;
            this.shop[index] = null;
            this.checkUpgrade();
            this.updateShop();
            return true;
        }
        console.log("대기석에 빈자리가 없습니다.");
        return false;
    }

    checkUpgrade() {
        // count cats
        let catIdTierAmount = {},
            checkingArea;
        if (this.game.state === GAME_STATES.ARRANGE)
            checkingArea = [...this.board, this.queue];
        else checkingArea = [this.queue];

        checkingArea.forEach((row) => {
            row.forEach((cat) => {
                if (!cat) return;
                if (!catIdTierAmount[cat.id])
                    catIdTierAmount[cat.id] = [0, 0, 0];
                catIdTierAmount[cat.id][cat.tier - 1]++;
            });
        });

        // upgrade cats
        while (true) {
            let isUpgraded = false;
            for (let id in catIdTierAmount)
                for (let tier = 0; tier < 2; ++tier) {
                    if (catIdTierAmount[id][tier] < 3) continue;
                    isUpgraded = true;
                    catIdTierAmount[id][tier] -= 3;
                    catIdTierAmount[id][tier + 1] += 1;
                    this.upgradeCat(id, tier + 1);
                }
            if (!isUpgraded) break;
        }
        this.updateBoard();
        this.updateQueue();
    }

    upgradeCat(id, tier) {
        let oldCat;
        for (let i = 0; i < 3 && !oldCat; ++i)
            for (let j = 0; j < 5; ++j) {
                if (
                    this.board[i][j] &&
                    this.board[i][j].id === id &&
                    this.board[i][j].tier == tier
                ) {
                    oldCat = this.board[i][j];
                    break;
                }
            }
        if (!oldCat)
            oldCat = this.queue.find((c) => c && c.id === id && c.tier == tier);

        let newCat = new SimpleCat(id, this, oldCat.x, oldCat.y, tier + 1);

        if (oldCat.y == IN_QUEUE) this.queue[oldCat.x] = newCat;
        else this.board[oldCat.y][oldCat.x] = newCat;

        let items = oldCat.items;
        let toDelete = 2;
        [...this.board, this.queue].forEach((row) => {
            row.forEach((c) => {
                if (c && c.id === id && c.tier == tier && toDelete) {
                    if (c.y == IN_QUEUE) this.queue[c.x] = null;
                    else this.board[c.y][c.x] = null;
                    items.push(...c.items);
                    toDelete--;
                }
            });
        });

        items = items.length > 3 ? items.slice(0, 3) : items;
        items.forEach((item) => newCat.equip(item));
    }

    sellCat(cat) {
        // TODO > uid. Battle중인 cat이 player의 board의 cat과 같은 uid를 가짐 주의
        if (!cat) return false;
        this._money += cat.cost;

        let c;
        if (cat.y === IN_QUEUE) {
            c = this.queue[cat.x];
            this.queue[cat.x] = null;
            this.updateQueue();
        } else {
            c = this.board[cat.y][cat.x];
            this.board[cat.y][cat.x] = null;
            this.updateBoard();
            this.countSynergy();
        }
        c.items.forEach((item) => this.pushItem(item));

        return true;
    }

    putCat(uid, to) {
        if (to.y <= 2 && this.game.state !== GAME_STATES.ARRANGE) {
            this.updateQueue();
            return false;
        }

        let unitToMove = this.getCatByUid(uid),
            unitToSwap;
        console.log(unitToMove);
        if (!unitToMove) {
            this.updateBoard();
            this.updateQueue();
            return false;
        }

        if (unitToMove.y === IN_QUEUE) {
            // from queue
            if (to.y === IN_QUEUE) {
                // to queue
                unitToSwap = this.queue[to.x];
                this.queue[to.x] = unitToMove;
                this.queue[unitToMove.x] = unitToSwap;
            } else {
                // to board
                let amount = 0;
                this.board.forEach((row) => {
                    row.forEach((cat) => (cat ? amount++ : null));
                });

                unitToSwap = this.board[to.y][to.x];
                if (amount == this.level && !unitToSwap) {
                    this.updateBoard();
                    this.updateQueue();
                    return false;
                }

                this.board[to.y][to.x] = unitToMove;
                this.queue[unitToMove.x] = unitToSwap;

                this.countSynergy();
            }
        } else {
            // from board
            unitToMove = this.board[unitToMove.y][unitToMove.x];
            if (to.y === IN_QUEUE) {
                // to queue
                unitToSwap = this.queue[to.x];

                this.board[unitToMove.y][unitToMove.x] = unitToSwap;
                this.queue[to.x] = unitToMove;

                this.countSynergy();
            } else {
                // to board
                unitToSwap = this.board[to.y][to.x];
                this.board[to.y][to.x] = unitToMove;
                this.board[unitToMove.y][unitToMove.x] = unitToSwap;
            }
        }
        if (unitToSwap) {
            unitToSwap.x = unitToMove.x;
            unitToSwap.y = unitToMove.y;
        }

        unitToMove.x = to.x;
        unitToMove.y = to.y;
        this.updateBoard();
        this.updateQueue();
        return true;
    }

    countSynergy() {
        this.synergies = {};
        this.board.forEach((row) => {
            row.forEach((cat) => {
                if (!cat) return;
                cat.synergies.forEach((synergy) => {
                    if (!this.synergies[synergy]) this.synergies[synergy] = [];
                    if (!this.synergies[synergy].includes(cat.id))
                        this.synergies[synergy].push(cat.id);
                });
            });
        });
        this.updateSynergies();
    }

    reload(freeReload = false) {
        if (!freeReload) {
            if (this.money < 2) return false;
            this._money -= 2;
        }

        let result = [];
        let possibilities = SHOP_POSSIBILITIES[this.level - 1];

        for (let i = 0; i < 4; ++i) {
            let randomValue = Math.random() * 100;
            for (let cost = 1; cost <= 4; ++cost) {
                if (randomValue <= possibilities[cost - 1]) {
                    result.push(SimpleCat.getRandomCatTypeByCost(cost));
                    break;
                }
                randomValue -= possibilities[cost - 1];
            }
        }

        this._shop = result;
        return true;
    }

    buyExp() {
        if (this.money < 4) return false;
        if (this.level === SHOP_POSSIBILITIES.length) return false;
        this._money -= 4;
        this._exp += 4;
        return true;
    }

    pushItem(item) {
        for (let i = 0; i < this.items.length; ++i)
            if (this.items[i] === null) {
                this.items[i] = item;
                this.updateItems();
                return true;
            }
        return false;
    }

    giveItem(item, to) {
        let cat, battle;
        let curItem = this.items[item.y * 2 + item.x];
        if (!curItem) return false;

        if (to.y === 6) cat = this.queue[to.x];
        else if (this.game.state !== GAME_STATES.ARRANGE) {
            this.game.battles.forEach((b) => {
                if (b.player1 === this || b.player2 === this) {
                    battle = b;
                    cat = b.battleField.board[to.y][to.x];
                }
            });
            if (!battle) {
                console.log("giveItem: no battle");
                return false;
            }
        } else {
            cat = this.board[to.y - 3][to.x];
        }

        if (!cat) {
            console.log("giveItem: no cat");
            return false;
        }

        if (cat.equip(curItem)) {
            // find index of curItem
            this.items[this.items.findIndex((i) => i === curItem)] = null;
            this.updateItems();
            if (this.game.state !== GAME_STATES.ARRANGE && to.y !== 6)
                battle.updateUnit(cat);
            else {
                this.updateQueue();
                this.updateBoard();
            }
            return true;
        }
        console.log("giveItem: equip failed");
        return false;
    }

    reward() {
        this.reload(true);

        let income = 5;
        income += this.winning > 1 ? this.winning : 0;
        income += this.losing > 1 ? this.losing * 2 : 0;
        income += Math.min(parseInt(this.money / 10), 5);
        this._money = this.money + income;
        this._exp += 2;
    }

    // update messages
    updateShop() {
        if (!this.shop) return;
        sendMsg(this.ws, "shopUpdate", {
            player: this.id,
            shop: this.shop,
        });
    }

    updateMoney() {
        this.game.sendMsgToAll("moneyUpdate", {
            player: this.id,
            money: this.money,
        });
    }

    updateBoard() {
        this.game.sendMsgToAll("boardUpdate", {
            player: this.id,
            board: this.board,
        });
    }

    updateQueue() {
        this.game.sendMsgToAll("queueUpdate", {
            player: this.id,
            queue: this.queue,
        });
    }

    updateSynergies() {
        this.game.sendMsgToAll("synergiesUpdate", {
            player: this.id,
            synergies: this.synergies,
        });
    }

    updateLevel() {
        this.game.sendMsgToAll("levelUpdate", {
            player: this.id,
            level: this.level,
        });
    }

    updateExp() {
        sendMsg(this.ws, "expUpdate", {
            player: this.id,
            exp: this.exp,
            maxExp: this.maxExp,
        });
    }

    updateHp() {
        this.game.sendMsgToAll("hpUpdate", {
            player: this.id,
            hp: this.hp,
        });
    }

    updateWinning() {
        this.game.sendMsgToAll("winningUpdate", {
            player: this.id,
            winning: this.winning,
        });
    }

    updateLosing() {
        this.game.sendMsgToAll("losingUpdate", {
            player: this.id,
            losing: this.losing,
        });
    }

    updateItems() {
        this.game.sendMsgToAll("itemUpdate", {
            player: this.id,
            items: this.items,
        });
    }

    getCatByUid(uid) {
        let cat;
        [...this.board, this.queue].forEach((row) => {
            row.forEach((c) => {
                if (c && c.uid === uid) cat = c;
            });
        });
        return cat;
    }
}

module.exports = Player;
