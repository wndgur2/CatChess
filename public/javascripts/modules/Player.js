import Game from "./Game.js";
import SimpleCat from "./SimpleCat.js";
import Socket from "./Socket.js";
import { GAME_STATES } from "./constants.js";

export default class Player {
    static player = null;
    static players = [];
    static getPlayerById(id) {
        return Player.players.find((player) => player.id === id);
    }

    constructor(id) {
        Player.players.push(this);
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

    set _money(newMoney) {
        this.money = newMoney;
        if (this.id !== Socket.id) return;
        document.getElementById("money").innerHTML = newMoney;
    }

    set _exp(newExp) {
        this.exp = newExp;
        if (this.id !== Socket.id) return;
        document.getElementById("curExp").innerHTML = newExp;
    }

    set _level(newLevel) {
        this.level = newLevel;
        if (this.id !== Socket.id) return;
        document.getElementById("level").innerHTML = newLevel;
    }

    set _maxExp(newMaxExp) {
        this.maxExp = newMaxExp;
        if (this.id !== Socket.id) return;
        document.getElementById("maxExp").innerHTML = newMaxExp;
    }

    set _hp(newHp) {
        this.hp = newHp;
        document.getElementById(`${this.id}-hp`).innerHTML = newHp;
    }

    set _board(newBoard) {
        this.board = newBoard.map((row) =>
            row.map((cat) => {
                if (cat) return new SimpleCat(cat);
                else return null;
            })
        );
        if (this.id !== Socket.id) return;
        if (Game.state === GAME_STATES.ARRANGE)
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 5; j++) {
                    let cell = document.getElementById(`ally-${i}-${j}`);
                    if (this.board[i][j] === null) {
                        cell.draggable = false;
                        cell.innerHTML = "";
                    } else {
                        if (Game.state === GAME_STATES.ARRANGE)
                            cell.draggable = true;
                        cell.innerHTML = this.board[i][j].display();
                    }
                }
            }
    }

    set _queue(newQueue) {
        this.queue = newQueue.map((cat) => {
            if (cat) return new SimpleCat(cat);
            else return null;
        });
        if (this.id !== Socket.id) return;
        for (let i = 0; i < 7; i++) {
            let cell = document.getElementById(`queue-${i}`);
            if (this.queue[i] === null) {
                cell.draggable = false;
                cell.innerHTML = "";
            } else {
                cell.draggable = true;
                cell.innerHTML = this.queue[i].display();
            }
        }
    }

    set _shoplist(newShoplist) {
        this.shoplist = newShoplist;
        if (this.id !== Socket.id) return;
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
