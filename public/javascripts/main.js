import Socket from "./modules/Socket.js";
import Player from "./modules/Player.js";
import Game from "./modules/Game.js";
import SimpleCat from "./modules/SimpleCat.js";

window.onload = () => {
    init();
};

function init() {
    Socket.init();
    hydrate();
}

function hydrate() {
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
    shopEl.addEventListener("drop", shopDragDrop);
    shopEl.addEventListener("dragover", shopDragOver);
    shopEl.addEventListener("dragleave", shopDragLeave);

    // 3 x 5 enemy board
    for (let i = 0; i < 3; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("div");
            cell.id = `enemy-${i}-${j}`;
            cell.className = "cell";
            cell.addEventListener("click", cellClick);
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
            cell.addEventListener("dragstart", cellDragStart);
            cell.addEventListener("dragover", cellDragOver);
            cell.addEventListener("drop", cellDragDrop);
            cell.addEventListener("click", cellClick);
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
        cell.addEventListener("dragstart", cellDragStart);
        cell.addEventListener("dragover", cellDragOver);
        cell.addEventListener("drop", cellDragDrop);
        cell.addEventListener("click", cellClick);
        cell.draggable = false;
        document.getElementById("queue").appendChild(cell);
    }
}

function cellDragStart(event) {
    let unit = getCellUnitByCellId(event.target.id);
    Player.player.dragging = unit;
}

function cellDragOver(event) {
    event.preventDefault();
}

function cellDragDrop(event) {
    Socket.sendMsg("reqPutCat", {
        from: Player.player.dragging,
        to: event.target.id,
    });
}

function cellClick(event) {
    let unit = getCellUnitByCellId(event.target.id);
    if (!unit) return;
    displayUnitInfo(unit);

    setTimeout(() => {
        Game.clickEvent = document
            .getElementById("game")
            .addEventListener("click", gameClick, true);
    }, 500);
}

/**
 *
 * @param {SimpleCat} unit
 */
function displayUnitInfo(unit) {
    let rightWrapper = document.getElementById("rightWrapper");
    rightWrapper.innerHTML = unit.info();
}

function gameClick(event) {
    Game.displayPlayersInfo();
    document
        .getElementById("game")
        .removeEventListener("click", gameClick, true);
}

function shopDragOver(event) {
    event.preventDefault();
    let shopEl = document.getElementById("shop");
    shopEl.innerHTML = `고양이 판매하기<br/>💰${Player.player.dragging.cost}`;
}

function shopDragDrop(event) {
    Socket.sendMsg("reqSellCat", {
        cat: Player.player.dragging,
    });
    Player.player._shop = Player.player.shop;
}

function shopDragLeave(event) {
    Player.player._shop = Player.player.shop;
}

function getCellUnitByCellId(id) {
    // TODO : enemy도 가능하게
    let position = id.split("-");
    if (position[0] === "ally") {
        return Player.player.board[position[1]][position[2]];
    } else {
        return Player.player.queue[position[1]];
    }
}
