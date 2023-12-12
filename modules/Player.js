const SimpleCat = require("./SimpleCat");

class Player {
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
    }

    buyCat(catId) {
        let x = 5,
            y = 4;
        for (let i = 0; i < board[3].length; ++i) {
            if (board[3][i] === null) {
                x = i;
                y = 3;
                break;
            }
        }
        if (x === 5 || y === 4) {
            console.log("더 이상 배치할 수 없습니다.");
            return false;
        }
        board[3][x] = new SimpleCat(catId, this, 1, x, y);
        this.money -= board[3][i].price;

        return true;
    }

    sellCat(cat) {
        if (this.game.state !== GAME_STATE.ARRANGE && cat.y < 3) {
            console.log("전투중인 기물은 팔 수 없습니다.");
            return false;
        }
        this.money += cat.price;
        this.board[cat.y][cat.x] = null;

        return true;
    }

    putCat(cat, x, y) {
        if (this.game.state !== GAME_STATE.ARRANGE) {
            console.log("전투중에는 기물을 배치할 수 없습니다.");
            return false;
        }
        if (!this.board[3].includes(cat)) {
            console.log("대기석에 있는 기물이 아닙니다. ", cat);
            return false;
        }

        if (board[y][x] === null) {
            this.board[y][x] = cat;
            this.board[y][x] = null;
        } else {
            let temp = cat;
            this.board[cat.y][cat.x] = this.board[y][x];
            this.board[y][x] = temp;
        }
        cat.x = x;
        cat.y = y;

        return true;
    }
}

module.exports = Player;
