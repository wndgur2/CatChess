import Battle from "./Battle.js";
import Game from "./Game.js";
import Player from "./Player.js";
import Socket from "./Socket.js";
import Painter from "./Painter.js";
import Unit from "./Unit.js";
import { DRAGGING_TYPES } from "./constants/CONSTS.js";

export default class UI {
    static draggingId;
    static isDragging = false;

    static init() {
        this.hydrate();
        Painter.initScene();
    }

    static hydrate() {
        document.getElementById("enterGame").addEventListener("click", () => {
            Socket.sendMsg("startWaiting", "");
            document.getElementById("home").style.display = "none";
            document.getElementById("game").style.display = "none";
            document.getElementById("waiting").style.display = "flex";
        });

        document.getElementById("reload").addEventListener("click", () => {
            Socket.sendMsg("reqReload", "");
        });

        document.getElementById("buyExp").addEventListener("click", () => {
            Socket.sendMsg("reqBuyExp", "");
        });

        let shopEl = document.getElementById("shop");
        shopEl.addEventListener("mouseover", UI.shopMouseOver);
        shopEl.addEventListener("mouseleave", UI.shopMouseLeave);
        shopEl.addEventListener("pointerup", UI.shopPointerUp);

        // 2 x 3 inventory
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("div");
            row.className = "row";
            for (let j = 0; j < 2; j++) {
                let item = document.createElement("div");
                item.id = `inventory-${i}-${j}`;

                item.className = "cell";
                item.addEventListener("dragstart", UI.itemDragStart);
                item.addEventListener("click", UI.itemClick); // change to hover
                item.draggable = false;
                row.appendChild(item);
            }
            document.getElementById("inventory").appendChild(row);
        }
    }

    static gameStart() {
        document.getElementById("home").style.display = "none";
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";

        Painter.startRendering();
    }

    static itemDragStart(event) {
        UI.draggingId = event.target.id;
        UI.isDragging = true;
    }

    static itemDragOver(event) {
        event.preventDefault();
    }

    /**
     * @param {Unit} unit
     */
    static displayUnitInfo(unit) {
        let rightWrapper = document.getElementById("rightWrapper");
        rightWrapper.innerHTML = unit.info();
    }

    static gameClick(event) {
        Game.displayPlayersInfo();
        document
            .getElementById("game")
            .removeEventListener("click", UI.gameClick, true);
    }

    static shopMouseOver(event) {
        if (!Painter.isDragging) return;
        event.preventDefault();
        let shopEl = document.getElementById("shop");
        shopEl.innerHTML = `고양이 판매하기<br/>💰${Painter.draggingObject.unit.cost}`;
    }

    static shopMouseLeave(event) {
        if (!Painter.isDragging) return;
        event.preventDefault();
        Player.player._shop = Player.player.shop;
    }

    static shopPointerUp(event) {
        if (!Painter.isDragging) return;
        Socket.sendMsg("reqSellCat", {
            cat: Painter.draggingObject.unit,
        });
        Player.player._shop = Player.player.shop;
    }

    static getCellUnitByCellId(id) {
        let position = id.split("-");

        switch (Game.state) {
            case "arrange":
                if (position[0] === "ally")
                    return Player.player.board[position[1]][position[2]];
                else return Player.player.queue[position[2]];
            default:
                if (position[0] === "ally")
                    return Battle.board[parseInt(position[1]) + 3][position[2]];
                else if (position[0] === "enemy")
                    return Battle.board[position[1]][position[2]];
                else return Player.player.queue[position[2]];
        }
    }

    static popUp(html, mouseEvent) {
        let popUp = document.getElementById("popUp");
        popUp.innerHTML = html;
        popUp.style.display = "flex";
        popUp.style.left = mouseEvent.clientX + "px";
        popUp.style.top = mouseEvent.clientY + "px";
    }

    static popDown() {
        let popUp = document.getElementById("popUp");
        popUp.style.display = "none";
    }

    static showUnitInfo(unit) {
        let unitInfoEl = document.getElementById("unitInfo");
        unit.showInfo();
        unitInfoEl.style.display = "flex";

        let shopEl = document.getElementById("shop");
        shopEl.style.display = "none";
    }

    static hideUnitInfo() {
        let unitInfoEl = document.getElementById("unitInfo");
        unitInfoEl.style.display = "none";

        let shopEl = document.getElementById("shop");
        shopEl.style.display = "flex";
    }
}
