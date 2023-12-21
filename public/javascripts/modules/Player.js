import Game from "./Game.js";
import Socket from "./Socket.js";
import { GAME_STATE } from "./constants.js";

export default class Player {
    static player = null;

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
        this._money = existingPlayer.money;
        this._board = existingPlayer.board;
        this._queue = existingPlayer.queue;
        this._level = existingPlayer.level;
        this._exp = existingPlayer.exp;
        this._maxExp = existingPlayer.maxExp;
        this._maxHp = existingPlayer.maxHp;
        this._hp = existingPlayer.hp;
        this._items = existingPlayer.items;
        this._shoplist = existingPlayer.shoplist;
    }

    set _money(newMoney) {
        this.money = newMoney;
        document.getElementById("money").innerHTML = newMoney;
    }

    set _exp(newExp) {
        this.exp = newExp;
        document.getElementById("curExp").innerHTML = newExp;
    }

    set _level(newLevel) {
        this.level = newLevel;
        document.getElementById("level").innerHTML = newLevel;
    }

    set _maxExp(newMaxExp) {
        this.maxExp = newMaxExp;
        document.getElementById("maxExp").innerHTML = newMaxExp;
    }

    set _hp(newHp) {
        this.hp = newHp;
        document.getElementById(`${this.id}-hp`).innerHTML = newHp;
    }

    set _board(newBoard) {
        this.board = newBoard;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                let cell = document.getElementById(`board-${i}-${j}`);
                if (newBoard[i][j] === null) {
                    cell.draggable = false;
                    cell.innerHTML = "";
                } else {
                    if (Game.state === GAME_STATE.ARRANGE)
                        cell.draggable = true;
                    cell.innerHTML = newBoard[i][j].type.name;
                }
            }
        }
    }

    set _queue(newQueue) {
        this.queue = newQueue;
        for (let i = 0; i < 7; i++) {
            let cell = document.getElementById(`queue-${i}`);
            if (newQueue[i] === null) {
                cell.draggable = false;
                cell.innerHTML = "";
            } else {
                cell.draggable = true;
                cell.innerHTML = newQueue[i].type.name;
            }
        }
    }

    set _shoplist(newShoplist) {
        this.shoplist = newShoplist;
        let list = document.getElementById("shoppingList");
        list.innerHTML = "";
        for (let i = 0; i < newShoplist.length; i++) {
            let wrapper = document.createElement("button");
            wrapper.style.display = "flex";
            wrapper.style.flexDirection = "column";
            wrapper.style.alignItems = "center";
            wrapper.style.justifyContent = "center";
            if (newShoplist[i] === null) {
                list.appendChild(wrapper);
                continue;
            }
            wrapper.onclick = function () {
                Socket.sendMsg("reqBuyCat", {
                    index: i,
                });
            };

            let cost = document.createElement("span");
            cost.innerHTML = newShoplist[i].cost + "💰";
            wrapper.appendChild(cost);

            let name = document.createElement("span");
            name.innerHTML = newShoplist[i].name;

            wrapper.appendChild(name);
            list.appendChild(wrapper);
        }
    }
}
