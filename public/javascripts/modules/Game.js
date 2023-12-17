import Player from "./Player.js";
import Socket from "./Socket.js";

export default class Game {
    static isStarted = false;
    static players = [];
    static getPlayerById(id) {
        return Game.players.find((player) => player.id === id);
    }
    static getUserPlayer() {
        return Game.players.find((player) => player.id === Socket.id);
    }

    static init(players) {
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";
        Game.players = [];
        Game.players = players.map((id) => new Player(id));
        Game.players.forEach((player) => {
            player.init();
        });
        Game.isStarted = true;
    }

    constructor() {}
}
