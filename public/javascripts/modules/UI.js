import Battle from "./Battle.js";
import Game from "./Game.js";
import Player from "./Player.js";
import Socket from "./Socket.js";
import Painter from "./Painter.js";

export default class UI {
    static draggingId;
    static isDragging = false;
    static infoUnit;

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

        document.addEventListener("keypress", (event) => {
            if (event.key === "D" || event.key === "d")
                Socket.sendMsg("reqReload", "");
            else if (event.key === "F" || event.key === "f")
                Socket.sendMsg("reqBuyExp", "");
            else if (event.key === "E" || event.key === "e")
                Painter.sellUnitOnKeypress();
        });

        document.getElementById("buyExp").addEventListener("click", () => {
            Socket.sendMsg("reqBuyExp", "");
        });

        let shopEl = document.getElementById("shop");
        shopEl.addEventListener("mouseenter", shopMouseEnter);
        shopEl.addEventListener("mouseleave", shopMouseLeave);
        shopEl.addEventListener("pointerup", shopPointerUp);

        // 2 x 3 inventory
        for (let i = 0; i < 3; i++) {
            let row = document.createElement("tr");
            row.className = "row";
            for (let j = 0; j < 2; j++) {
                let item = document.createElement("td");
                item.id = `inventory-${i}-${j}`;

                item.className = "cell";
                item.addEventListener("dragstart", inventoryDragStart);
                item.draggable = false;
                item.addEventListener("mouseenter", inventoryItemMouseEnter);
                item.addEventListener("mousemove", inventoryItemMouseMove);
                item.addEventListener("mouseleave", inventoryItemMouseLeave);
                row.appendChild(item);
            }
            document.getElementById("inventory").appendChild(row);
        }

        document
            .getElementById("inventory")
            .appendChild(document.getElementById("moneyWrapper"));

        let itemEls = document.getElementsByClassName("item");
        for (let i = 0; i < itemEls.length; i++) {
            itemEls[i].addEventListener("mouseover", itemMouseEnter);
            itemEls[i].addEventListener("mousemove", itemMouseMove);
            itemEls[i].addEventListener("mouseout", itemMouseLeave);
        }
    }

    static gameStart() {
        document.getElementById("home").style.display = "none";
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";

        Painter.startRendering();
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
        let popUpEl = document.getElementById("popUp");
        popUpEl.innerHTML = html;
        popUpEl.style.display = "flex";
        popUpEl.style.left = mouseEvent.clientX + "px";
        popUpEl.style.top = mouseEvent.clientY + "px";
    }

    static popDown() {
        let popUpEl = document.getElementById("popUp");
        popUpEl.style.display = "none";
    }

    static showUnitInfo(unit) {
        this.infoUnit = unit;
        let unitInfoEl = document.getElementById("unitInfo");
        unit.showInfo();
        unitInfoEl.style.display = "flex";

        let shopEl = document.getElementById("shop");
        shopEl.style.display = "none";
    }

    static hideUnitInfo() {
        let unitInfoEl = document.getElementById("unitInfo");
        unitInfoEl.style.display = "none";
        if (this.infoUnit) this.infoUnit.focused = false;
        this.infoUnit = null;

        let shopEl = document.getElementById("shop");
        shopEl.style.display = "flex";
    }
}

function inventoryDragStart(event) {
    UI.draggingId = event.target.id;
    UI.isDragging = true;
}

function inventoryItemMouseEnter(event) {
    let index =
        parseInt(this.id.split("-")[1]) * 2 + parseInt(this.id.split("-")[2]);
    if (Player.player.items[index])
        UI.popUp(Player.player.items[index].info(), event);
}

function inventoryItemMouseMove(event) {
    let index =
        parseInt(this.id.split("-")[1]) * 2 + parseInt(this.id.split("-")[2]);
    if (Player.player.items[index])
        UI.popUp(Player.player.items[index].info(), event);
}

function inventoryItemMouseLeave(event) {
    UI.popDown();
}

function itemMouseEnter(event) {
    console.log("mouseEnter");
    if (UI.infoUnit.items[this.id])
        UI.popUp(UI.infoUnit.items[this.id].info(), event);
}

function itemMouseMove(event) {
    if (UI.infoUnit.items[this.id])
        UI.popUp(UI.infoUnit.items[this.id].info(), event);
}

function itemMouseLeave(event) {
    UI.popDown();
}

function shopMouseEnter(event) {
    if (!Painter.isDragging) return;
    event.preventDefault();
    let shopEl = document.getElementById("shop");
    shopEl.innerHTML = `고양이 판매하기<br/>💰${Painter.draggingObject.unit.cost}`;
}

function shopMouseLeave(event) {
    if (!Painter.isDragging) return;
    event.preventDefault();
    Player.player._shop = Player.player.shop;
}

function shopPointerUp(event) {
    if (!Painter.isDragging) return;
    Socket.sendMsg("reqSellCat", {
        cat: Painter.draggingObject.unit,
    });
    Player.player._shop = Player.player.shop;
}
