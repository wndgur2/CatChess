const SimpleCat = require("./SimpleCat");
const { sendMsg } = require("./utils");

class Player {
    static players = [];

    static getPlayer(id) {
        return Player.players.find((player) => player.id === id);
    }

    static getNewId() {
        let id = 0;
        while (Player.getPlayer(id)) id++;
        return id;
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
    }

    /**
     * @param {number} newMoney
     */
    set _money(newMoney) {
        sendMsg(this.ws, "moneyUpdate", {
            player: this.id,
            money: newMoney,
        });
        console.log("money: " + this.money + " -> " + newMoney);
        this.money = parseInt(newMoney);
    }

    get _money() {
        return this.money;
    }

    buyCat(catType) {
        let cat = SimpleCat.catTypes[catType];
        if (!this.checkAffordable(cat.cost)) return false;

        for (let i = 0; i < this.queue.length; ++i) {
            if (this.queue[i] === null) {
                this.queue[i] = new SimpleCat(catType, this, i);
                this._money = this.money - cat.cost;
                this.game.sendMsgToAll("boardUpdate", {
                    player: this.id,
                    queue: this.queue.map((cat) => JSON.stringify(cat)),
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
        if (this.game.state !== GAME_STATE.ARRANGE && y < 3) {
            console.log("전투중인 기물은 팔 수 없습니다.");
            return false;
        }

        this.money += cat.price;
        this.board[cat.y][cat.x] = null;

        return true;
    }

    putCat({ befX, befY, nextX, nextY }) {
        if (this.game.state !== GAME_STATE.ARRANGE) {
            console.log("전투중에는 기물을 배치할 수 없습니다.");
            return false;
        }
        if (!this.board[befY][befX]) {
            console.log("대기석에 있는 기물이 아닙니다. ");
            return false;
        }

        if (board[nextY][nextX] === null) {
            this.board[nextY][nextX] = this.board[befY][befX];
            this.board[befY][befX] = null;
        } else {
            let temp = this.board[befY][befX];
            this.board[befY][befX] = this.board[y][x];
            this.board[nextY][nextX] = temp;

            this.board[befY][befX].x = befX;
            this.board[befY][befX].y = befY;
        }
        this.board[nextY][nextX].x = nextX;
        this.board[nextY][nextX].y = nextY;

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

        this.shoplist = result;

        sendMsg(this.ws, "resReload", {
            player: this.id,
            shoplist: result,
        });
        return true;
    }

    buyExp() {
        if (!this.checkAffordable(4)) return false;
        this._money -= 4;
        this.exp += 4;
        if (this.exp >= this.maxExp) {
            this.exp -= this.maxExp;
            this.level++;
            this.maxExp += 2;
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

    checkAffordable(price) {
        if (this.money < price) {
            console.log("돈이 부족합니다.");
            return false;
        }
        return true;
    }
}

module.exports = Player;
