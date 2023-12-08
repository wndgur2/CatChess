class Player {
    constructor(id, ws) {
        this.id = id;
        this.ws = ws;

        this.money = 0;
        this.waits = [];
        this.board = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
        ];
        this.level = 1;
        this.maxHp = 100;
        this.hp = 100;
    }

    buyCat(cat) {
        this.money -= cat.price;
        this.waits.push(cat);
    }

    sellCat(cat) {
        this.money += cat.price;

        if (this.board.includes(cat)) {
            if (this.game.state !== GAME_STATE.ARRANGE) {
                console.log("전투중인 기물은 팔 수 없습니다.");
                return;
            }
            this.board[this.board.indexOf(cat)] = null;
        } else if (this.waits.includes(cat))
            this.waits.splice(this.waits.indexOf(cat), 1);
    }

    putCat(cat, x, y) {
        if (this.game.state !== GAME_STATE.ARRANGE) {
            console.log("전투중에는 기물을 배치할 수 없습니다.");
            return;
        }
        if (!this.waits.includes(cat)) {
            console.log("보유중인 기물이 아닙니다. ", cat);
            return;
        }

        this.board[y][x] = cat;
        this.waits.splice(this.waits.indexOf(cat), 1);
    }
}

module.exports = Player;
