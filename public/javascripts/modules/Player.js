import Game from "./Game.js";
import Unit from "./Unit.js";
import Socket from "./Socket.js";
import { COST_COLORS, GAME_STATES, SYNERGIES } from "./constants/CONSTS.js";
import Painter from "./Painter.js";
import Synergy from "./Synergy.js";

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
        this.synergies = {};
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
            row.map((cat) => (cat ? new Unit(cat) : null))
        );

        if (this.id !== Socket.id) return;
        if (Game.state != GAME_STATES.ARRANGE) return;
        Painter._board = [
            ...new Array(3).fill(null).map(() => new Array(5).fill(null)),
            ...this.board,
        ];
    }

    set _queue(newQueue) {
        this.queue = newQueue.map((cat) => (cat ? new Unit(cat) : null));

        if (this.id !== Socket.id) return;
        Painter._allyQueue = this.queue;
    }

    set _shop(newShop) {
        this.shop = newShop;
        if (this.id !== Socket.id) return;
        let shop = document.getElementById("shop");
        shop.innerHTML = "";
        for (let i = 0; i < newShop.length; i++) {
            let unit = document.createElement("button");
            shop.appendChild(unit);
            if (newShop[i] === null) continue;
            unit.onclick = function () {
                Socket.sendMsg("reqBuyCat", {
                    index: i,
                });
            };

            let unitImageContainer = document.createElement("div");
            unitImageContainer.className = "unitImageContainer";
            unitImageContainer.style.backgroundImage = `url(/images/units/${newShop[i].id}.jpg)`;

            let gradient = document.createElement("div");
            gradient.className = "gradient";
            unitImageContainer.appendChild(gradient);

            unit.appendChild(unitImageContainer);

            let unitInfo = document.createElement("div");
            unitInfo.className = "shopUnitInfo";

            if (newShop[i] === null) {
                shop.appendChild(unit);
                continue;
            }

            let name = document.createElement("span");
            name.innerHTML = newShop[i].name;
            name.style.color = COST_COLORS[newShop[i].cost];
            unitInfo.appendChild(name);

            let synergiesEl = document.createElement("div");
            synergiesEl.className = "shopSynergies";

            for (let synergy of newShop[i].synergies) {
                synergiesEl.appendChild(new Synergy({ id: synergy }).display());
            }
            unitInfo.appendChild(synergiesEl);

            let cost = document.createElement("span");
            cost.innerHTML = newShop[i].cost + "💰";
            unitInfo.appendChild(cost);

            unit.appendChild(unitInfo);
        }
    }

    set _winning(newWinning) {
        this.winning = parseInt(newWinning);
        if (this.id !== Socket.id) return;
        if (newWinning === 0) return;
        // let streakEl = document.getElementById("streak");
        // streakEl.innerHTML = `🔥${newWinning}`;
    }

    get _winning() {
        return this.winning;
    }

    set _losing(newLosing) {
        this.losing = parseInt(newLosing);
        if (this.id !== Socket.id) return;
        if (newLosing === 0) return;
        // let streakEl = document.getElementById("streak");
        // streakEl.innerHTML = `😭${newLosing}`;
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
            itemEl.innerHTML = newItems[i].image;
        }
    }

    set _synergies(newSynergies) {
        this.synergies = newSynergies;
        if (this.id !== Socket.id) return;
        let synergiesEl = document.getElementById("synergies");
        synergiesEl.innerHTML = "";
        for (let synergy in newSynergies) {
            synergiesEl.appendChild(
                new Synergy({ id: synergy }).display(newSynergies[synergy])
            );
        }
    }

    setDamage(unit, damage) {}
}
