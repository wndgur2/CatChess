import Game from "./Game.js";
import Unit from "./Unit.js";
import Socket from "./Socket.js";
import { GAME_STATES } from "./constants.js";

export default class Player {
    static player = null;
    static players = [];
    /**
     * @param {String} id
     * @returns {Player}
     */
    static getPlayerById(id) {
        return Player.players.find((player) => player.id === id);
    }

    constructor(id) {
        Player.players.push(this);
        this.id = id;
        if (id === Socket.id) Player.player = this;
        this.board = [
            [null, null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null],
        ];
        this.queue = [null, null, null, null, null, null, null];
        this.items = [null, null, null, null, null, null];
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
        let el = document.getElementById(`${this.id}-hp`);
        if (el) el.innerHTML = newHp;
    }

    set _board(newBoard) {
        this.board = newBoard.map((row) =>
            row.map((cat) => {
                if (cat) return new Unit(cat);
                else return null;
            })
        );

        if (this.id !== Socket.id) return;
        if (Game.state != GAME_STATES.ARRANGE) return;

        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 5; j++) {
                let cell = document.getElementById(`ally-${i}-${j}`);
                if (this.board[i][j] === null) {
                    cell.draggable = false;
                    cell.innerHTML = "";
                } else {
                    cell.draggable = true;
                    cell.innerHTML = this.board[i][j].display();
                }
            }
    }

    set _queue(newQueue) {
        this.queue = newQueue.map((cat) => {
            if (cat) return new Unit(cat);
            else return null;
        });
        if (this.id !== Socket.id) return;
        for (let i = 0; i < 7; i++) {
            let cell = document.getElementById(`queue-3-${i}`);
            if (this.queue[i] === null) {
                cell.draggable = false;
                cell.innerHTML = "";
            } else {
                cell.draggable = true;
                cell.innerHTML = this.queue[i].display();
            }
        }
    }

    set _shop(newShop) {
        this.shop = newShop;
        if (this.id !== Socket.id) return;
        let shop = document.getElementById("shop");
        shop.innerHTML = "";
        for (let i = 0; i < newShop.length; i++) {
            let unit = document.createElement("button");
            unit.style.display = "flex";
            unit.style.flexDirection = "column";
            unit.style.alignItems = "center";
            unit.style.justifyContent = "center";

            if (newShop[i] === null) {
                shop.appendChild(unit);
                continue;
            }
            unit.onclick = function () {
                Socket.sendMsg("reqBuyCat", {
                    index: i,
                });
            };

            let cost = document.createElement("span");
            cost.innerHTML = newShop[i].cost + "💰";
            unit.appendChild(cost);

            let name = document.createElement("span");
            name.innerHTML = newShop[i].name;

            unit.appendChild(name);
            shop.appendChild(unit);
        }
    }

    set _winning(newWinning) {
        this.winning = parseInt(newWinning);
        if (this.id !== Socket.id) return;
        if (newWinning === 0) return;
        let streakEl = document.getElementById("streak");
        streakEl.innerHTML = `🔥${newWinning}`;
    }

    get _winning() {
        return this.winning;
    }

    set _losing(newLosing) {
        this.losing = parseInt(newLosing);
        if (this.id !== Socket.id) return;
        if (newLosing === 0) return;
        let streakEl = document.getElementById("streak");
        streakEl.innerHTML = `😭${newLosing}`;
    }

    get _losing() {
        return this.losing;
    }

    set _items(newItems) {
        this.items = newItems;
        if (this.id !== Socket.id) return;
        for (let i = 0; i < newItems.length; i++) {
            let itemEl = document.getElementById(
                `inventory-${parseInt(i / 2)}-${i % 2}`
            );
            if (!newItems[i]) {
                itemEl.innerHTML = "";
                itemEl.draggable = false;
                continue;
            }
            itemEl.draggable = true;
            itemEl.innerHTML = newItems[i].info();
        }
    }
}
