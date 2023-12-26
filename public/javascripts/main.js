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

    // TODO 리스트 살리기. 샵 위에 팔기 이벤트용 엘리먼트 생성?
    document.getElementById("shop").addEventListener("drop", reqSellCat);
    document.getElementById("shop").addEventListener("dragover", showSellCat);

    // 3 x 5 enemy board
    for (let i = 0; i < 3; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("div");
            cell.className = "cell";
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
            cell.id = `ally-${i}-${j}`;
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

function showSellCat(event) {
    event.preventDefault();
    event.target.innerHTML = `고양이 판매하기<br/>💰${Player.player.dragging.cost}`;
}

function reqSellCat(event) {
    Socket.sendMsg("reqSellCat", {
        cat: Player.player.dragging,
    });
    Player.player._shop = Player.player.shop;
}

function getCellUnitByCellId(id) {
    let position = id.split("-");
    if (position[0] === "ally") {
        return Player.player.board[position[1]][position[2]];
    } else {
        return Player.player.queue[position[1]];
    }
}
