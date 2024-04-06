import Game from "./Game.js";
import Unit from "./Unit.js";
import Socket from "./Socket.js";
import { COST_COLORS, GAME_STATES } from "./constants/CONSTS.js";
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
        this.damageChart = {};
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
// 여기랑 큐 client data에서 생성하도록?
// 2성은? ... 언어 설정(디바이스 설정) 때문에
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
        let shopListEl = document.getElementsByClassName("shopListWrapper");
        for (let i = 0; i < newShop.length; i++) {
            if (!newShop[i]) {
                shopListEl[i].style.visibility = "hidden";
                continue;
            }
            shopListEl[i].style.visibility = "visible";
            let shopImageWrapper =
                shopListEl[i].getElementsByClassName("shopImageWrapper")[0];
            shopImageWrapper.style.backgroundImage = `url(/images/portraits/${newShop[i].id}.jpg)`;

            let name = shopListEl[i].getElementsByClassName("shopUnitName")[0];
            name.innerHTML = newShop[i].name;
            name.style.color = COST_COLORS[newShop[i].cost];

            let cost = shopListEl[i].getElementsByClassName("shopUnitCost")[0];
            cost.innerHTML = newShop[i].cost;

            let synergiesEl =
                shopListEl[i].getElementsByClassName("shopSynergies")[0];

            synergiesEl.innerHTML = "";

            for (let synergy of newShop[i].synergies)
                synergiesEl.appendChild(Synergy.getSynergy(synergy).display());
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
            itemEl.innerHTML = "";
            itemEl.appendChild(newItems[i].imageEl);
        }
    }

    set _synergies(newSynergies) {
        this.synergies = newSynergies;
        if (this.id !== Socket.id) return;
        let synergiesEl = document.getElementById("synergies");
        synergiesEl.innerHTML = "";
        for (let synergy in newSynergies) {
            synergiesEl.appendChild(
                Synergy.getSynergy(synergy).display(
                    newSynergies[synergy] ? newSynergies[synergy].length : 0
                )
            );
        }
    }

    updateDamage(unit, damage) {
        if (this.damageChart[unit.uid]) {
            this.damageChart[unit.uid] += damage;
            document.getElementById(`${unit.uid}-damage`).innerHTML = `${
                unit.name
            }${"★".repeat(unit.tier)}: ${this.damageChart[unit.uid]}`;
        } else {
            this.damageChart[unit.uid] = damage;
            const damageChartEl = document.getElementById("damage");
            const damageEl = document.createElement("div");
            damageEl.id = `${unit.uid}-damage`;
            damageEl.className = "damage";
            damageEl.innerHTML = `${unit.name}${"★".repeat(
                unit.tier
            )}: ${damage}`;
            damageEl.style.color = unit.color;
            damageChartEl.appendChild(damageEl);
        }
    }
}
