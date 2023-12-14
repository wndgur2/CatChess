const SimpleCat = require("./SimpleCat");

class Player {
    static players = [];

    static getPlayer(id) {
        return Player.players.find((player) => player.id === id);
    }

    constructor(id, ws) {
        this.id = id;
        this.ws = ws;

        this.money = 0;
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
}

module.exports = Player;
