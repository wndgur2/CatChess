const SimpleCat = require("./SimpleCat");
const { sendMsg } = require("./utils");

class Player {
    static players = [];

    static getPlayer(id) {
        return Player.players.find((player) => player.id === id);
    }

    static getNewId() {
        //random 5 string
        return Math.random().toString(36).substr(2, 6);
    }

    constructor(id, ws) {
        Player.players.push(this);

        this.id = id;
        this.ws = ws;
    }

    init() {
        this.money = 150;
        this.board = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
        ];
        this.queue = [null, null, null, null, null, null, null];
        this.level = 1;
        this.exp = 0;
        this.maxExp = 2;
        this.maxHp = 100;
        this.hp = 100;
        this.items = [];
        this.reload();
    }

    updatePlayer() {
        this.updateExp();
        this.updateLevel();
        this.updateShop();
        this.updateMoney();
        this.updateBoard();
    }

    /**
     * @param {number} newMoney
     */
    set _money(newMoney) {
        this.money = parseInt(newMoney);
        this.updateMoney();
    }

    buyCat(index) {
        if (!this.shop[index]) return false;
        let catId = this.shop[index].id;
        let catProto = SimpleCat.prototypes[catId];
        if (this.money < catProto.cost) return false;

        for (let i = 0; i < this.queue.length; ++i) {
            if (this.queue[i] === null) {
                this.queue[i] = new SimpleCat(catId, this, i);
                this._money = this.money - catProto.cost;
                this.shop[index] = null;
                this.checkUpgrade();
                this.updateBoard();
                this.updateShop();
                return true;
            }
        }
        console.log("대기석에 빈자리가 없습니다.");
        return false;
    }

    checkUpgrade() {
        let tier_species_amount = {};
        [...this.board, this.queue].forEach((row) => {
            row.forEach((cat) => {
                if (!cat) return;
                if (!tier_species_amount[cat.id]) {
                    tier_species_amount[cat.id] = {};
                    if (!tier_species_amount[cat.id][cat.tier])
                        tier_species_amount[cat.id][cat.tier] = 0;
                }
                tier_species_amount[cat.id][cat.tier]++;
            });
        });

        while (true) {
            let upgrade = false;
            for (let id in tier_species_amount) {
                let species = tier_species_amount[id];
                for (let tier in species) {
                    if (species[tier] >= 3) {
                        console.log("need Upgrade");
                        species[tier] -= 3;
                        species[parseInt(tier) + 1] += 1;
                        upgrade = true;

                        let cat;
                        [...this.board, this.queue].forEach((row) => {
                            cat = row.find((c) => {
                                if (!c) return false;
                                console.log(c.id, c.tier);
                                return c.id === id && c.tier == tier;
                            });
                        });

                        let newCat = new SimpleCat(
                            id,
                            this,
                            cat.x,
                            cat.y,
                            parseInt(tier) + 1
                        );

                        if (cat.y === 3) this.queue[cat.x] = newCat;
                        else this.board[cat.y][cat.x] = newCat;

                        let amountToDelete = 2;
                        [...this.board, this.queue].forEach((row) => {
                            row.forEach((tempCat) => {
                                if (
                                    tempCat &&
                                    tempCat.id === id &&
                                    tempCat.tier == tier &&
                                    amountToDelete > 0
                                ) {
                                    if (tempCat.y == 3)
                                        this.queue[tempCat.x] = null;
                                    else
                                        this.board[tempCat.y][tempCat.x] = null;
                                    amountToDelete--;
                                    console.log(amountToDelete);
                                }
                            });
                        });
                    }
                }
            }
            if (!upgrade) break;
        }
    }

    sellCat(cat) {
        if (!cat) return false;
        this.money += cat.cost;
        if (cat.y === 3) this.queue[cat.x] = null;
        else this.board[cat.y][cat.x] = null;
        this.updateBoard();
        this.updateMoney();

        return true;
    }

    putCat({ befX, befY, nextX, nextY }) {
        let unitToMove, unitToSwap;
        const IN_QUEUE = 3;

        if (befY === IN_QUEUE) {
            // from queue
            unitToMove = this.queue[befX];
            if (nextY === IN_QUEUE) {
                // to queue
                unitToSwap = this.queue[nextX];
                this.queue[nextX] = unitToMove;
                this.queue[befX] = unitToSwap;
            } else {
                // to board
                let amount = 0;
                this.board.forEach((row) => {
                    row.forEach((cat) => {
                        if (cat) amount++;
                    });
                });
                if (amount == this.level) return false;

                unitToSwap = this.board[nextY][nextX];
                this.board[nextY][nextX] = unitToMove;
                this.queue[befX] = unitToSwap;
            }
        } else {
            // from board
            unitToMove = this.board[befY][befX];
            if (nextY === IN_QUEUE) {
                // to queue
                unitToSwap = this.queue[nextX];
                this.queue[nextX] = unitToMove;
                this.board[befY][befX] = unitToSwap;
            } else {
                // to board
                unitToSwap = this.board[nextY][nextX];
                this.board[nextY][nextX] = unitToMove;
                this.board[befY][befX] = unitToSwap;
            }
        }
        if (unitToSwap) {
            unitToSwap.x = befX;
            unitToSwap.y = befY;
        }
        unitToMove.x = nextX;
        unitToMove.y = nextY;

        this.updateBoard();
        return true;
    }

    reload() {
        if (this.money < 2) return false;
        this._money = this.money - 2;

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
        this.exp += 4;
        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level++;
            this.maxExp += 3;
            this.updateLevel();
        }
        this.updateMoney();
        this.updateExp();
        return true;
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
            board: this.board.map((row) =>
                row.map((cat) => JSON.stringify(cat))
            ),
            queue: this.queue.map((cat) => JSON.stringify(cat)),
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
        });
    }
}

module.exports = Player;
