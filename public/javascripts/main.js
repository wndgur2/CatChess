import Socket from "./modules/Socket.js";
import Player from "./modules/Player.js";

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

    // 3 x 5 enemy board
    for (let i = 0; i < 3; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("div");
            cell.id = `enemy-${i}-${j}`;
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
            cell.id = `cell-${i}-${j}`;
            hydrateCell(cell);
            row.appendChild(cell);
        }
        document.getElementById("board").appendChild(row);
    }

    // 1 x 7 queue
    for (let i = 0; i < 7; i++) {
        let cell = document.createElement("div");
        cell.id = `queue-${i}`;
        hydrateCell(cell);
        document.getElementById("queue").appendChild(cell);
    }
}

function hydrateCell(cell) {
    cell.className = "cell";
    cell.addEventListener("dragstart", cellDragStart);
    cell.addEventListener("dragover", cellDragOver);
    cell.addEventListener("drop", cellDragDrop);
    cell.draggable = false;
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

function getCellUnitByCellId(id) {
    // TODO: 아군 board 좌표가 0부터 시작하도록
    let position = id.split("-");
    if (position[0] === "cell") {
        return Player.player.board[position[1]][position[2]];
    } else {
        return Player.player.queue[position[1]];
    }
}
