import Player from "./Player.js";
import Socket from "./Socket.js";

export default class Game {
    static isStarted = false;
    static players = [];
    static getPlayerById(id) {
        return Game.players.find((player) => player.id === id);
    }

    static init(players, existingPlayers) {
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";
        Game.players = [];
        Game.players = players.map((id) => new Player(id));
        Game.players.forEach((player) => {
            if (existingPlayers) {
                Object.keys(existingPlayers).forEach((id) => {
                    Game.getPlayerById(id).load(existingPlayers[id]);
                });
            } else {
                player.init();
                Socket.sendMsg("reqReload", "");
            }
        });
        Game.isStarted = true;
    }

    constructor() {}
}
