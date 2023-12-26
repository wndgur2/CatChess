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
        sendMsg(this.ws, "expUpdate", {
            player: this.id,
            exp: this.exp,
        });
        sendMsg(this.ws, "levelUpdate", {
            player: this.id,
            level: this.level,
        });
        sendMsg(this.ws, "shopUpdate", {
            player: this.id,
            shop: this.shop,
        });
        sendMsg(this.ws, "moneyUpdate", {
            player: this.id,
            money: this.money,
        });
        sendMsg(this.ws, "boardUpdate", {
            player: this.id,
            board: this.board.map((row) =>
                row.map((cat) => JSON.stringify(cat))
            ),
            queue: this.queue.map((cat) => JSON.stringify(cat)),
        });
    }

    /**
     * @param {number} newMoney
     */
    set _money(newMoney) {
        sendMsg(this.ws, "moneyUpdate", {
            player: this.id,
            money: newMoney,
        });
        this.money = parseInt(newMoney);
    }

    get _money() {
        return this.money;
    }

    buyCat(index) {
        let catId = this.shop[index].id;
        let catProto = SimpleCat.prototypes[catId];
        if (!this.checkAffordable(catProto.cost)) return false;

        for (let i = 0; i < this.queue.length; ++i) {
            if (this.queue[i] === null) {
                this.queue[i] = new SimpleCat(catId, this, i);
                this._money = this.money - catProto.cost;
                this.game.sendMsgToAll("boardUpdate", {
                    player: this.id,
                    board: this.board.map((row) =>
                        row.map((cat) => JSON.stringify(cat))
                    ),
                    queue: this.queue.map((cat) => JSON.stringify(cat)),
                });
                this.shop[index] = null;
                sendMsg(this.ws, "shopUpdate", {
                    player: this.id,
                    shop: this.shop,
                });
                return true;
            }
        }
        console.log("대기석에 빈자리가 없습니다.");
        return false;
    }

    sellCat({ x, y }) {
        let cat = this.board[y][x];
        if (!cat) return false;
        this.money += cat.cost;
        this.board[cat.y][cat.x] = null;

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

        this.game.sendMsgToAll("boardUpdate", {
            player: this.id,
            board: this.board.map((row) =>
                row.map((cat) => JSON.stringify(cat))
            ),
            queue: this.queue.map((cat) => JSON.stringify(cat)),
        });
        return true;
    }

    reload() {
        if (!this.checkAffordable(2)) return false;
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

        sendMsg(this.ws, "shopUpdate", {
            player: this.id,
            shop: result,
        });
        return true;
    }

    buyExp() {
        if (!this.checkAffordable(4)) return false;
        if (this.level === 6) return false;
        this._money -= 4;
        this.exp += 4;
        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level++;
            this.maxExp += 3;
            this.game.sendMsgToAll("levelUpdate", {
                player: this.id,
                level: this.level,
            });
        }
        this.game.sendMsgToAll("moneyUpdate", {
            player: this.id,
            money: this.money,
        });
        sendMsg(this.ws, "expUpdate", {
            exp: this.exp,
        });
        return true;
    }

    checkAffordable(cost) {
        if (this.money < cost) {
            console.log("돈이 부족합니다.");
            return false;
        }
        return true;
    }
}

module.exports = Player;
