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
    static newPlayer(from, ws) {
        if (Player.getPlayer(from)) return;
        Game.waitingPlayers.push(new Player(from, ws));
        Game.waitingPlayers.forEach((player) => {
            sendMsg(player.ws, "newPlayer", Game.waitingPlayers.length);
        });
        if (Game.waitingPlayers.length >= 1) {
            let game = new Game(Game.waitingPlayers.splice(0, 1));
        }
    }
    static getGameData(from, ws) {
        let player = Player.getPlayer(from);
        if (!player) return false;
        player.ws = ws;
        let game = player.game;
        let gameData = {
            state: game.state,
            players: game.players.map((player) => player.id),
        };
        let playerData = {};
        game.players.forEach((player) => {
            playerData[player.id] = {
                money: player.money,
                board: player.board,
                queue: player.queue,
                level: player.level,
                exp: player.exp,
                maxExp: player.maxExp,
                maxHp: player.maxHp,
                hp: player.hp,
                items: player.items,
                shoplist: player.shoplist,
            };
        });
        console.log("SEND TO ", player.id);
        sendMsg(player.ws, "resGameData", {
            game: gameData,
            players: playerData,
        });
    }

    constructor(players) {
        this.players = players;
        console.log("game start");
        console.log(this.players.map((p) => p.id));
        this.players.forEach((player) => {
            player.game = this;
            player.init();
        });

        Game.games.push(this);

        this.players.forEach((player) => {
            sendMsg(player.ws, "gameMatched", {
                players: this.players.map((player) => player.id),
            });
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

    sendMsgToAll(type, data) {
        this.players.forEach((player) => {
            sendMsg(player.ws, type, data);
        });
    }
}

module.exports = Game;
