const Player = require("./Player.js");
const { sendMsg } = require("./utils.js");
const { GAME_STATE } = require("./constants.js");

const PLAYER_NUM = 1;

class Game {
    static waitingPlayers = [];
    static games = [];
    static newPlayer(from, ws) {
        if (Player.getPlayer(from)) return;
        Game.waitingPlayers.push(new Player(from, ws));
        Game.waitingPlayers.forEach((player) => {
            sendMsg(player.ws, "newPlayer", Game.waitingPlayers.length);
        });
        if (Game.waitingPlayers.length >= PLAYER_NUM) {
            let game = new Game(Game.waitingPlayers.splice(0, PLAYER_NUM));
        }
    }
    static getGameData(from, ws) {
        let player = Player.getPlayer(from);
        if (!player) return false;
        if (!player.game) return false;
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

        this.round = 1;
        this.stage = 0;
        this.arrange();
    }

    set _stage(newStage) {
        if (newStage === 6) {
            this.round++;
            newStage = 1;
        }
        this.stage = newStage;
        this.sendMsgToAll("stageUpdate", {
            round: this.round,
            stage: this.stage,
        });
    }

    arrange() {
        this._stage = this.stage + 1;
        this.state = GAME_STATE.ARRANGE;
        this.sendMsgToAll("stateUpdate", this.state);
        setTimeout(() => {
            this.wait();
        }, 20000);
    }

    wait() {
        this.state = GAME_STATE.WAIT;
        this.sendMsgToAll("stateUpdate", this.state);
        setTimeout(() => {
            this.battle();
        }, 3000);
    }

    battle() {
        this.state = GAME_STATE.BATTLE;
        this.sendMsgToAll("stateUpdate", this.state);
        setTimeout(() => {
            this.arrange();
        }, 30000);
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
