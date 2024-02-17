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
    }

    static hydrate() {
        document.getElementById("enterGame").addEventListener("click", () => {
            Socket.sendMsg("startMatching", "");
            document.getElementById("home").style.display = "none";
            document.getElementById("game").style.display = "none";
            document.getElementById("waiting").style.display = "flex";
        });

        document.getElementById("modalClose").addEventListener("click", () => {
            document.getElementById("modal").style.display = "none";
        });

        document
            .getElementById("surrenderBtn")
            .addEventListener("click", () => {
                const modalEl = document.getElementById("modal");
                modalEl.style.display = "flex";
                const modalBodyEl = document.getElementById("modalBody");
                const surrenderEl = document.getElementById("surrenderWrapper");
                modalBodyEl.innerHTML = surrenderEl.innerHTML;
            });

        document.getElementById("settingBtn").addEventListener("click", () => {
            const modalEl = document.getElementById("modal");
            modalEl.style.display = "flex";
            const modalBodyEl = document.getElementById("modalBody");
            const settingEl = document.getElementById("settingWrapper");
            modalBodyEl.innerHTML = settingEl.innerHTML;
        });

        document.getElementById("reload").addEventListener("click", () => {
            Socket.sendMsg("reqReload", "");
        });

        document.addEventListener("keypress", (event) => {
            if (event.key.toUpperCase() === "D")
                Socket.sendMsg("reqReload", "");
            else if (event.key.toUpperCase() === "F")
                Socket.sendMsg("reqBuyExp", "");
            else if (event.key.toUpperCase() === "E")
                Painter.sellUnitOnKeypress();
        });

        document.getElementById("buyExp").addEventListener("click", () => {
            Socket.sendMsg("reqBuyExp", "");
        });

        let shopEl = document.getElementById("shop");
        shopEl.addEventListener("mouseenter", shopMouseEnter);
        shopEl.addEventListener("mouseleave", shopMouseLeave);
        shopEl.addEventListener("pointerup", shopPointerUp);

        let shoplistEl = document.getElementById("shoplist");
        for (let i = 0; i < shoplistEl.children.length; ++i) {
            shoplistEl.children[i].addEventListener("click", () => {
                if (!Player.player.shop[i]) return;
                Socket.sendMsg("reqBuyCat", {
                    index: i,
                });
                UI.popDown();
            });
        }

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
                item.addEventListener("mousemove", inventoryItemMouseMove);
                item.addEventListener("mouseleave", inventoryItemMouseLeave);
                row.appendChild(item);
            }
            document.getElementById("items").appendChild(row);
        }

        document
            .getElementById("inventory")
            .appendChild(document.getElementById("moneyWrapper"));

        // unit info
        let itemEls = document.getElementsByClassName("item");
        for (let i = 0; i < itemEls.length; i++) {
            itemEls[i].addEventListener("mousemove", itemMouseMove);
            itemEls[i].addEventListener("mouseout", itemMouseLeave);
        }

        let skillEl = document.getElementById("unitSkillWrapper");
        skillEl.addEventListener("mousemove", skillMouseMove);
        skillEl.addEventListener("mouseout", skillMouseLeave);
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

        if (mouseEvent.clientX + popUpEl.clientWidth > window.innerWidth)
            popUpEl.style.left =
                mouseEvent.clientX - popUpEl.clientWidth + "px";
        else popUpEl.style.left = mouseEvent.clientX + "px";

        if (mouseEvent.clientY + popUpEl.clientHeight > window.innerHeight)
            popUpEl.style.top =
                mouseEvent.clientY - popUpEl.clientHeight + "px";
        else popUpEl.style.top = mouseEvent.clientY + "px";
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

        let sellEl = document.getElementById("sell");
        sellEl.style.display = "none";

        let shoplistEl = document.getElementById("shoplist");
        shoplistEl.style.display = "flex";

        let shopEl = document.getElementById("shop");
        shopEl.style.display = "flex";
    }

    static gameStart() {
        document.getElementById("home").style.display = "none";
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";

        Painter.startRendering();
    }

    static gameEnd() {
        document.getElementById("game").style.display = "none";
        document.getElementById("home").style.display = "flex";
        Painter.clear();
    }
}

function inventoryDragStart(event) {
    UI.draggingId = event.target.id;
    UI.isDragging = true;
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

function itemMouseMove(event) {
    if (UI.infoUnit.items[this.id])
        UI.popUp(UI.infoUnit.items[this.id].info(), event);
}

function itemMouseLeave(event) {
    UI.popDown();
}

function skillMouseMove(event) {
    UI.popUp(UI.infoUnit.skillInfo(), event);
}

function skillMouseLeave(event) {
    UI.popDown();
}

function shopMouseEnter(event) {
    if (!Painter.isDragging) return;
    event.preventDefault();

    let shoplistEl = document.getElementById("shoplist");
    shoplistEl.style.display = "none";

    let sellEl = document.getElementById("sell");
    sellEl.innerHTML = `고양이 판매하기 [E]<br/>💰${Painter.draggingObject.unit.cost}`;
    sellEl.style.display = "flex";
}

function shopMouseLeave(event) {
    if (!Painter.isDragging) return;
    event.preventDefault();

    let sellEl = document.getElementById("sell");
    sellEl.style.display = "none";

    let shoplistEl = document.getElementById("shoplist");
    shoplistEl.style.display = "flex";
}

function shopPointerUp(event) {
    if (!Painter.isDragging) return;
    Socket.sendMsg("reqSellCat", {
        uid: Painter.draggingObject.unit.uid,
    });

    let sellEl = document.getElementById("sell");
    sellEl.style.display = "none";

    let shoplistEl = document.getElementById("shoplist");
    shoplistEl.style.display = "flex";

    Player.player._shop = Player.player.shop;
}
