import Socket from "./Socket.js";

export default class Player {
    constructor(id) {
        this.id = id;
        if (id === Socket.id) Player.player = this;
        this.init();
    }

    init() {
        console.log("init", this.id);
        this.money = 20;
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

    load(existingPlayer) {
        this.money = existingPlayer.money;
        this.board = existingPlayer.board;
        this.queue = existingPlayer.queue;
        this.level = existingPlayer.level;
        this.exp = existingPlayer.exp;
        this.maxExp = existingPlayer.maxExp;
        this.maxHp = existingPlayer.maxHp;
        this.hp = existingPlayer.hp;
        this.items = existingPlayer.items;
        this.shoplist = existingPlayer.shoplist;
    }

    set money(newMoney) {
        document.getElementById("money").innerHTML = newMoney;
    }

    set exp(newExp) {
        document.getElementById("curExp").innerHTML = newExp;
    }

    set level(newLevel) {
        document.getElementById("level").innerHTML = newLevel;
    }

    set maxExp(newMaxExp) {
        document.getElementById("maxExp").innerHTML = newMaxExp;
    }

    set board(newBoard) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                let cell = document.getElementById(`cell-${i + 3}-${j}`);
                if (newBoard[i][j] === null) {
                    cell.innerHTML = "";
                } else {
                    cell.innerHTML = newBoard[i][j].type.name;
                }
            }
        }
    }

    set queue(newQueue) {
        for (let i = 0; i < 7; i++) {
            let cell = document.getElementById(`queue-${i}`);
            if (newQueue[i] === null) {
                cell.innerHTML = "";
            } else {
                cell.innerHTML = newQueue[i].type.name;
            }
        }
    }

    set shoplist(newShoplist) {
        let list = document.getElementById("shoppingList");
        list.innerHTML = "";
        for (let i = 0; i < newShoplist.length; i++) {
            let wrapper = document.createElement("button");
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "column";
            wrapper.style.alignItems = "center";
            wrapper.style.justifyContent = "center";
            wrapper.onclick = function () {
                Socket.sendMsg("reqBuyCat", newShoplist[i].type);
            };

            let cost = document.createElement("span");
            cost.innerHTML = newShoplist[i].cost + "코";
            wrapper.appendChild(cost);

            let name = document.createElement("span");
            name.innerHTML = newShoplist[i].name;

            wrapper.appendChild(name);
            list.appendChild(wrapper);
        }
    }
}
