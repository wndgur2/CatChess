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

        if (this.board.includes(cat))
            this.board[this.board.indexOf(cat)] = null;
        else if (this.waits.includes(cat))
            this.waits.splice(this.waits.indexOf(cat), 1);
    }

    putCat(cat, x, y) {
        if (!this.waits.includes(cat)) return;

        this.board[y][x] = cat;
        this.waits.splice(this.waits.indexOf(cat), 1);
    }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = Player;
}

// ES6 Modules (browser)
if (typeof window !== "undefined") {
    window.Player = Player;
}
