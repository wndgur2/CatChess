const { sendMsg } = require("./utils.js");

const GAME_STATE = {
    ARRANGE: "arrange",
    BATTLE: "battle",
    CREEP: "creep",
    FINISH: "finish",
};

Object.freeze(GAME_STATE);

class Game {
    constructor(players) {
        this.players = players;
        console.log("game start");
        this.players.forEach((player) => {
            player.game = this;
        });
        this.arrange();
    }

    arrange() {
        this.state = GAME_STATE.ARRANGE;
        this.players.forEach((player) => {
            sendMsg(player.ws, "gameState", this.state);
        });
    }

    getGameData() {
        return "gamedata";
    }
}

module.exports = Game;
