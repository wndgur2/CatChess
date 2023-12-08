import Socket from "./modules/Socket.js";
import Player from "./modules/Player.js";
import Game from "./modules/Game.js";

let player = new Player();

window.onload = () => {
    init();
};

function init() {
    Socket.init();
    hydrate();
}

function hydrate() {
    document.getElementById("enterGame").addEventListener("click", () => {
        Socket.sendMsg("addPlayer", "");
        document.getElementById("home").style.display = "none";
        document.getElementById("waiting").style.display = "flex";
    });
    document.getElementById("reload").addEventListener("click", () => {
        Socket.sendMsg("reload", "");
    });
}
