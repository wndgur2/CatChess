const SimpleCat = require("./SimpleCat");
const { MAX_LEVEL, SHOP_POSSIBILITIES } = require("./constants/CONSTS");
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
        this.level = 1;
        this.exp = -2;
        this.money = -3;
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
    }

    updatePlayer() {
        this.updateHp();
        this.updateExp();
        this.updateLevel();
        this.updateShop();
        this.updateMoney();
        this.updateBoard();
        this.updateQueue();
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
        if (this.level === MAX_LEVEL) return;
        this.exp = parseInt(newExp);
        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level++;
            this.maxExp += 3;
            this.updateLevel();
        }
        this.updateExp();
    }
    get _exp() {
        return this.exp;
    }

    set _winning(newWinning) {
        this.winning = parseInt(newWinning);
        this.updateWinning();
    }
    get _winning() {
        return this.winning;
    }

    set _losing(newLosing) {
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
        if (this.game.state === "arrange")
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
        if (!cat) return false;
        this._money += cat.cost;

        let c;
        if (cat.y === IN_QUEUE) {
            c = this.queue[cat.x];
            this.queue[cat.x] = null;
        } else {
            c = this.board[cat.y][cat.x];
            this.board[cat.y][cat.x] = null;
        }
        c.items.forEach((item) => {
            this.pushItem(item);
        });

        this.updateBoard();
        return true;
    }

    putCat(before, next) {
        let unitToMove, unitToSwap;

        if (before.y === IN_QUEUE) {
            // from queue
            unitToMove = this.queue[before.x];
            if (next.y === IN_QUEUE) {
                // to queue
                unitToSwap = this.queue[next.x];
                this.queue[next.x] = unitToMove;
                this.queue[before.x] = unitToSwap;
            } else {
                // to board
                let amount = 0;
                this.board.forEach((row) => {
                    row.forEach((cat) => {
                        if (cat) amount++;
                    });
                });

                unitToSwap = this.board[next.y][next.x];
                if (amount == this.level && !unitToSwap) return false;

                this.board[next.y][next.x] = unitToMove;
                this.queue[before.x] = unitToSwap;
            }
        } else {
            // from board
            unitToMove = this.board[before.y][before.x];
            if (next.y === IN_QUEUE) {
                // to queue
                unitToSwap = this.queue[next.x];
                this.queue[next.x] = unitToMove;
                this.board[before.y][before.x] = unitToSwap;
            } else {
                // to board
                unitToSwap = this.board[next.y][next.x];
                this.board[next.y][next.x] = unitToMove;
                this.board[before.y][before.x] = unitToSwap;
            }
        }

        if (unitToSwap) {
            unitToSwap.x = before.x;
            unitToSwap.y = before.y;
        }

        unitToMove.x = next.x;
        unitToMove.y = next.y;
        this.updateBoard();
        this.updateQueue();
        return true;
    }

    reload(freeReload = false) {
        if (!freeReload) {
            if (this.money < 2) return false;
            this._money = this.money - 2;
        }

        let result = [];
        let possibilities = SHOP_POSSIBILITIES[this.level - 1];

        for (let i = 0; i < 4; ++i) {
            let random = Math.random() * 100;
            for (let cost = 1; cost <= 4; ++cost) {
                if (random <= possibilities[cost - 1]) {
                    result.push(SimpleCat.getRandomCatTypeByCost(cost));
                    break;
                }
                random -= possibilities[cost - 1];
            }
        }

        this._shop = result;
        return true;
    }

    buyExp() {
        if (this.money < 4) return false;
        if (this.level === 6) return false;
        this._money -= 4;
        this._exp += 4;
        return true;
    }

    pushItem(item) {
        for (let i = 0; i < this.items.length; ++i) {
            if (this.items[i] === null) {
                this.items[i] = item;
                this.updateItems();
                return true;
            }
        }
        return false;
    }

    giveItem({ item, to }) {
        let catPos = to.split("-"),
            itemPos = item.split("-");

        let cat;
        let curItem =
            this.items[parseInt(itemPos[1]) * 2 + parseInt(itemPos[2])];
        if (!curItem) return false;

        if (catPos[0] === "ally") cat = this.board[catPos[1]][catPos[2]];
        else cat = this.queue[catPos[1]];
        if (!cat) return false;
        if (cat.items.length >= 3) return false;
        if (cat.equip(curItem)) {
            this.items = this.items.filter((i) => i != curItem);
            this.updateItems();
            this.updateBoard();
        }
        return true;
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
}

module.exports = Player;
