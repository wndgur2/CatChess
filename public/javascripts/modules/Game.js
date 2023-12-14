import Player from "./Player.js";
import Socket from "./Socket.js";

export default class Game {
    static isStarted = false;
    static players = [];

    static init() {
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";
        Game.isStarted = true;
    }

    static setGame(data) {}

    constructor() {}
}
