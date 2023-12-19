import Socket from "./modules/Socket.js";

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

    // create 6 x 5 board
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        row.id = `row-${i}`;
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("td");
            cell.id = `cell-${i}-${j}`;
            cell.className = "cell";
            row.appendChild(cell);
        }
        document.getElementById("boardBody").appendChild(row);
    }
}
