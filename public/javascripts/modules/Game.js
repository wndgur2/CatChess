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
    static setSinglePlayer(data) {
        let modifiedPlayer = Game.players.find(
            (player) => player.id === data.id
        );
        modifiedPlayer.setData(data);
    }
    constructor() {}
}
