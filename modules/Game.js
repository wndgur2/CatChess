const Player = require("./Player.js");
const { sendMsg } = require("./utils.js");

const GAME_STATE = {
    ARRANGE: "arrange",
    BATTLE: "battle",
    CREEP: "creep",
    FINISH: "finish",
};

Object.freeze(GAME_STATE);

class Game {
    static waitingPlayers = [];

    static games = [];

    constructor(players) {
        this.players = players;
        console.log("game start");
        this.players.forEach((player) => {
            player.game = this;
            player.init();
        });
        Game.games.push(this);
        this.arrange();
    }

    static newPlayer(from, ws) {
        Game.waitingPlayers.push(new Player(from, ws));
        Game.waitingPlayers.forEach((player) => {
            sendMsg(player.ws, "newPlayer", Game.waitingPlayers.length);
        });
        if (Game.waitingPlayers.length >= 1) {
            let game = new Game(Game.waitingPlayers.splice(0, 3));
            game.players.forEach((player) => {
                sendMsg(player.ws, "gameMatched", {
                    players: game.players.map((player) => player.id),
                });
            });
        }
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

    sendMsgToAll(type, data) {
        this.players.forEach((player) => {
            sendMsg(player.ws, type, data);
        });
    }
}

module.exports = Game;
