const SimpleCat = require("./SimpleCat");
const { sendMsg } = require("./utils");

class Player {
    static players = [];

    static getPlayer(id) {
        return Player.players.find((player) => player.id === id);
    }

    constructor(id, ws) {
        Player.players.push(this);

        this.id = id;
        this.ws = ws;
        this.init();
    }

    init() {
        this.money = 20;
        this.board = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
        ];
        this.level = 1;
        this.exp = 0;
        this.maxHp = 100;
        this.hp = 100;
        this.items = [];
    }

    buyCat(catType) {
        for (let i = 0; i < this.board[3].length; ++i) {
            if (this.board[3][i] === null) {
                y = 3;
                this.board[3][i] = new SimpleCat(catType, this, x);
                this.money -= this.board[3][i].price;
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
        this.money -= 2;

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
        let random = Math.random() * 100;

        for (let i = 0; i < 4; ++i) {
            for (let cost = 1; cost <= 4; ++cost) {
                if (random < possibilities[cost - 1]) {
                    result.push(SimpleCat.getRandomCatTypeByCost(cost));
                    break;
                }
                random -= possibilities[cost - 1];
            }
        }

        sendMsg(this.ws, "resReload", result);
        this.game.sendMsgToAll("moneyUpdate", {
            player: this.id,
            money: this.money,
        });
        return true;
    }

    buyExp() {
        if (!this.checkAffordable(4)) return false;
        this.money -= 4;
        this.exp += 4;
        if (this.exp >= 4 * this.level) {
            this.exp -= 4 * this.level;
            this.level++;
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
