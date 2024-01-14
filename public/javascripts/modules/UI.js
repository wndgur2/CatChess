import Battle from "./Battle.js";
import Game from "./Game.js";
import Player from "./Player.js";
import Socket from "./Socket.js";
import Unit from "./Unit.js";

export default class UI {
    static dragging;

    static hydrate() {
        document.getElementById("enterGame").addEventListener("click", () => {
            Socket.sendMsg("startWaiting", "");
            document.getElementById("home").style.display = "none";
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
        shopEl.addEventListener("dragleave", UI.shopDragLeave);

        // 3 x 5 enemy board
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("div");
            row.className = "row";
            for (let j = 0; j < 5; j++) {
                let cell = document.createElement("div");
                cell.id = `enemy-${i}-${j}`;
                cell.className = "cell";
                cell.addEventListener("click", UI.cellClick);
                cell.draggable = false;
                row.appendChild(cell);
            }
            document.getElementById("board").appendChild(row);
        }

        // 3 x 5 ally board
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("div");
            row.className = "row";
            for (let j = 0; j < 5; j++) {
                let cell = document.createElement("div");
                cell.id = `ally-${i}-${j}`;

                cell.className = "cell";
                cell.addEventListener("dragstart", UI.cellDragStart);
                cell.addEventListener("dragover", UI.cellDragOver);
                cell.addEventListener("drop", UI.cellDragDrop);
                cell.addEventListener("click", UI.cellClick);
                cell.draggable = false;
                row.appendChild(cell);
            }
            document.getElementById("board").appendChild(row);
        }

        // 1 x 7 queue
        for (let i = 0; i < 7; i++) {
            let cell = document.createElement("div");
            cell.id = `queue-${i}`;

            cell.className = "cell";
            cell.addEventListener("dragstart", UI.cellDragStart);
            cell.addEventListener("dragover", UI.cellDragOver);
            cell.addEventListener("drop", UI.cellDragDrop);
            cell.addEventListener("click", UI.cellClick);
            cell.draggable = false;
            document.getElementById("queue").appendChild(cell);
        }

        // 2 x 3 inventory
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("div");
            row.className = "row";
            for (let j = 0; j < 2; j++) {
                let item = document.createElement("div");
                item.id = `inventory-${i}-${j}`;

                item.className = "cell";
                item.addEventListener("dragstart", UI.itemDragStart);
                item.addEventListener("dragover", UI.itemDragOver);
                item.addEventListener("click", UI.itemClick);
                item.draggable = false;
                row.appendChild(item);
            }
            document.getElementById("inventory").appendChild(row);
        }
    }

    static itemDragStart(event) {
        UI.dragging = event.target.id;
    }

    static itemDragOver(event) {
        event.preventDefault();
    }

    static itemClick(event) {
        // let item = UI.getItemByCellId(event.target.id);
        // if (!item) return;
        // UI.displayItemInfo(item);
        // setTimeout(() => {
        //     Game.clickEvent = document
        //         .getElementById("game")
        //         .addEventListener("click", UI.gameClick, true);
        // }, 500);
    }

    static cellDragStart(event) {
        UI.dragging = UI.getCellUnitByCellId(event.target.id);
    }

    static cellDragOver(event) {
        event.preventDefault();
    }

    static cellDragDrop(event) {
        if (UI.dragging.tier) {
            Socket.sendMsg("reqPutCat", {
                from: UI.dragging,
                to: event.target.id,
            });
        } else {
            Socket.sendMsg("reqGiveItem", {
                item: UI.dragging,
                to: event.target.id,
            });
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
        shopEl.innerHTML = `고양이 판매하기<br/>💰${UI.dragging.cost}`;
    }

    static shopDragDrop(event) {
        Socket.sendMsg("reqSellCat", {
            cat: UI.dragging,
        });
        Player.player._shop = Player.player.shop;
    }

    static shopDragLeave(event) {
        Player.player._shop = Player.player.shop;
    }

    static getCellUnitByCellId(id) {
        let position = id.split("-");
        console.log(position);
        switch (Game.state) {
            case "arrange":
                if (position[0] === "ally")
                    return Player.player.board[position[1]][position[2]];
                else return Player.player.queue[position[1]];
            default:
                if (position[0] === "ally")
                    return Battle.board[parseInt(position[1]) + 3][position[2]];
                else if (position[0] === "enemy")
                    return Battle.board[position[1]][position[2]];
                else return Player.player.queue[position[1]];
        }
    }

    static displayItemInfo(item) {
        let rightWrapper = document.getElementById("rightWrapper");
        rightWrapper.innerHTML = item.info();
    }
}
