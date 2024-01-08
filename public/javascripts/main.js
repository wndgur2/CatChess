import Socket from "./modules/Socket.js";
import Player from "./modules/Player.js";
import Game from "./modules/Game.js";
import SimpleCat from "./modules/SimpleCat.js";
import Battle from "./modules/Battle.js";

let dragging = null;

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

    // 2 x 3 inventory
    for (let i = 0; i < 3; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 2; j++) {
            let item = document.createElement("div");
            item.id = `inventory-${i}-${j}`;

            item.className = "cell";
            item.addEventListener("dragstart", itemDragStart);
            item.addEventListener("dragover", itemDragOver);
            item.addEventListener("click", itemClick);
            item.draggable = false;
            row.appendChild(item);
        }
        document.getElementById("inventory").appendChild(row);
    }
}

// TODO 드래깅 시작 -> 드래깅 끝 -> 서버 전송 체계 짜기.
// idea: type(unit, item), 출발 position, 도착 position만 주면 된다.

function itemDragStart(event) {
    dragging = event.target.id;
}

function itemDragOver(event) {
    event.preventDefault();
}

function itemClick(event) {
    let item = getItemByCellId(event.target.id);
    if (!item) return;
    displayItemInfo(item);

    setTimeout(() => {
        Game.clickEvent = document
            .getElementById("game")
            .addEventListener("click", gameClick, true);
    }, 500);
}

function cellDragStart(event) {
    dragging = getCellUnitByCellId(event.target.id);
}

function cellDragOver(event) {
    event.preventDefault();
}

function cellDragDrop(event) {
    if (dragging.tier) {
        Socket.sendMsg("reqPutCat", {
            from: dragging,
            to: event.target.id,
        });
    } else {
        Socket.sendMsg("reqGiveItem", {
            item: dragging,
            to: event.target.id,
        });
    }
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
    shopEl.innerHTML = `고양이 판매하기<br/>💰${dragging.cost}`;
}

function shopDragDrop(event) {
    Socket.sendMsg("reqSellCat", {
        cat: dragging,
    });
    Player.player._shop = Player.player.shop;
}

function shopDragLeave(event) {
    Player.player._shop = Player.player.shop;
}

function getCellUnitByCellId(id) {
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

function displayItemInfo(item) {
    let rightWrapper = document.getElementById("rightWrapper");
    rightWrapper.innerHTML = item.info();
}
