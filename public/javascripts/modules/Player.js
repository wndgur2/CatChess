import Socket from "./Socket.js";

export default class Player {
    constructor(id) {
        this.id = id;
        this.init();
    }

    init() {
        console.log("init", this.id);
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
}
