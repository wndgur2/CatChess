const SimpleCat = require("./SimpleCat");
const { MAX_LEVEL } = require("./constants/CONSTS");
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
        this.money = 0;
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

    buyCat(index) {
        if (!this.shop[index]) return false;
        let catId = this.shop[index].id;
        let catProto = SimpleCat.prototypes[catId];
        if (this.money < catProto.cost) return false;

        for (let i = 0; i < this.queue.length; ++i) {
            if (this.queue[i]) continue;

            this.queue[i] = new SimpleCat(catId, this, i);
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
        let tier_species_amount = {},
            boardToCount;
        if (this.game.state === "arrange")
            boardToCount = [...this.board, this.queue];
        else boardToCount = [this.queue];

        boardToCount.forEach((row) => {
            row.forEach((cat) => {
                if (!cat) return;
                if (!tier_species_amount[cat.id])
                    tier_species_amount[cat.id] = [0, 0, 0];
                tier_species_amount[cat.id][cat.tier - 1]++;
            });
        });

        // upgrade cats
        while (true) {
            let isUpgraded = false;
            for (let id in tier_species_amount) {
                let species_amount = tier_species_amount[id];
                for (let tier = 0; tier < 2; ++tier) {
                    if (species_amount[tier] < 3) continue;
                    isUpgraded = true;
                    species_amount[tier] -= 3;
                    species_amount[tier + 1] += 1;
                    this.upgradeCat(id, tier + 1);
                }
            }
            if (!isUpgraded) break;
        }
        this.updateBoard();
    }

    upgradeCat(id, tier) {
        let oldCat;
        for (let i = 0; i < 3; ++i)
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

        let items = oldCat.items;

        if (oldCat.y == IN_QUEUE) this.queue[oldCat.x] = newCat;
        else this.board[oldCat.y][oldCat.x] = newCat;

        let amountToDelete = 2;
        [...this.board, this.queue].forEach((row) => {
            row.forEach((c) => {
                if (c && c.id === id && c.tier == tier && amountToDelete) {
                    if (c.y == IN_QUEUE) this.queue[c.x] = null;
                    else this.board[c.y][c.x] = null;
                    items.push(...c.items);
                    amountToDelete--;
                }
            });
        });

        items = items.length > 3 ? items.slice(0, 3) : items;
        items.forEach((item) => {
            newCat.equip(item);
        });
    }

    sellCat(cat) {
        if (!cat) return false;
        this.money += cat.cost;

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
        this.updateMoney();

        return true;
    }

    putCat({ beforeX, beforeY, nextX, nextY }) {
        let unitToMove, unitToSwap;

        if (beforeY === IN_QUEUE) {
            // from queue
            unitToMove = this.queue[beforeX];
            if (nextY === IN_QUEUE) {
                // to queue
                unitToSwap = this.queue[nextX];
                this.queue[nextX] = unitToMove;
                this.queue[beforeX] = unitToSwap;
            } else {
                // to board
                let amount = 0;
                this.board.forEach((row) => {
                    row.forEach((cat) => {
                        if (cat) amount++;
                    });
                });

                unitToSwap = this.board[nextY][nextX];
                if (amount == this.level && !unitToSwap) return false;

                this.board[nextY][nextX] = unitToMove;
                this.queue[beforeX] = unitToSwap;
            }
        } else {
            // from board
            unitToMove = this.board[beforeY][beforeX];
            if (nextY === IN_QUEUE) {
                // to queue
                unitToSwap = this.queue[nextX];
                this.queue[nextX] = unitToMove;
                this.board[beforeY][beforeX] = unitToSwap;
            } else {
                // to board
                unitToSwap = this.board[nextY][nextX];
                this.board[nextY][nextX] = unitToMove;
                this.board[beforeY][beforeX] = unitToSwap;
            }
        }
        if (unitToSwap) {
            unitToSwap.x = beforeX;
            unitToSwap.y = beforeY;
        }
        unitToMove.x = nextX;
        unitToMove.y = nextY;
        this.updateBoard();
        return true;
    }

    reload(freeReload = false) {
        if (!freeReload) {
            if (this.money < 2) return false;
            this._money = this.money - 2;
        }

        let result = [];
        let possibilities = [];
        switch (this.level) {
            case 1:
                possibilities = [100, 0, 0, 0];
                break;
            case 2:
                possibilities = [100, 0, 0, 0];
                break;
            case 3:
                possibilities = [75, 25, 0, 0];
                break;
            case 4:
                possibilities = [50, 30, 20, 0];
                break;
            case 5:
                possibilities = [30, 40, 25, 5];
                break;
            case 6:
                possibilities = [15, 25, 35, 25];
                break;
        }

        for (let i = 0; i < 4; ++i) {
            let random = Math.random() * 100;
            for (let cost = 1; cost <= 4; ++cost) {
                if (random < possibilities[cost - 1]) {
                    result.push(SimpleCat.getRandomCatTypeByCost(cost));
                    break;
                }
                random -= possibilities[cost - 1];
            }
        }

        this.shop = result;

        this.updateShop();
        return true;
    }

    buyExp() {
        if (this.money < 4) return false;
        if (this.level === 6) return false;
        this._money -= 4;
        this._exp += 4;
        this.updateMoney();
        this.updateExp();
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
