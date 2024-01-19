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
        shopEl.addEventListener("drop", UI.shopDragDrop);
        shopEl.addEventListener("dragover", UI.shopDragOver);

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

    static itemClick(event) {
        // change it to hovering
        //
        // let item = UI.getItemByCellId(event.target.id);
        // if (!item) return;
        // UI.displayItemInfo(item);
        // setTimeout(() => {
        //     Game.clickEvent = document
        //         .getElementById("game")
        //         .addEventListener("click", UI.gameClick, true);
        // }, 500);
    }

    static cellDragDrop(event) {
        switch (UI.draggingType) {
            case DRAGGING_TYPES.ITEM:
                Socket.sendMsg("reqGiveItem", {
                    item: {
                        x: parseInt(UI.draggingId.split("-")[2]),
                        y: parseInt(UI.draggingId.split("-")[1]),
                    },
                    to: {
                        x: parseInt(event.target.id.split("-")[2]),
                        y: parseInt(event.target.id.split("-")[1]),
                    },
                });
                break;
        }
    }

    static cellClick(event) {
        let unit = UI.getCellUnitByCellId(event.target.id);
        if (!unit) return;
        UI.displayUnitInfo(unit);

        setTimeout(() => {
            Game.clickEvent = document
                .getElementById("game")
                .addEventListener("click", UI.gameClick, true);
        }, 500);
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

    static shopDragOver(event) {
        event.preventDefault();
        let shopEl = document.getElementById("shop");
        shopEl.innerHTML = `고양이 판매하기<br/>💰${UI.draggingId.cost}`;
    }

    static shopDragDrop(event) {
        Socket.sendMsg("reqSellCat", {
            cat: UI.draggingId,
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

    static displayItemInfo(item) {
        let rightWrapper = document.getElementById("rightWrapper");
        rightWrapper.innerHTML = item.info();
    }
}
