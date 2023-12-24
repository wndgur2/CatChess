const Player = require("./Player.js");
const { sendMsg } = require("./utils.js");
const { GAME_STATES } = require("./constants/GAME_STATES.js");
const Battle = require("./Battle.js");

const PLAYER_NUM = 2;

class Game {
    static waitingPlayers = [];
    static games = [];
    static newPlayer(from, ws) {
        if (Player.getPlayer(from)) {
            Player.getPlayer(from).ws = ws;
            // 게임 데이터 전송
            let game = Player.getPlayer(from).game;
            if (game && game.state !== GAME_STATES.FINISH) {
                sendMsg(ws, "gameMatched", {
                    players: game.players.map((player) => player.id),
                });
                game.sendGameData(from);
                return;
            }
        }
        Game.waitingPlayers.push(new Player(from, ws));
        Game.waitingPlayers.forEach((player) => {
            sendMsg(player.ws, "newPlayer", Game.waitingPlayers.length);
        });
        if (Game.waitingPlayers.length >= PLAYER_NUM) {
            Game.games.push(
                new Game(Game.waitingPlayers.splice(0, PLAYER_NUM))
            );
        }
    }

    constructor(players) {
        this.players = players;
        console.log("game start");
        console.log(this.players.map((p) => p.id));

        Game.games.push(this);

        this.players.forEach((player) => {
            sendMsg(player.ws, "gameMatched", {
                players: this.players.map((player) => player.id),
            });
        });
        this.players.forEach((player) => {
            player.game = this;
            player.init();
        });

        this.round = 1;
        this.stage = 0;
        this.arrangeState();
        setInterval(() => {
            if (this.time <= 0) return;
            this.time = this.time - 1;
            this.sendMsgToAll("timeUpdate", {
                time: this.time,
            });
        }, 1000);
    }

    sendGameData(from) {
        let player = Player.getPlayer(from);
        let ws = player.ws;
        sendMsg(ws, "stateUpdate", {
            state: this.state,
            time: this.time,
        });
        sendMsg(ws, "stageUpdate", {
            round: this.round,
            stage: this.stage,
        });
        if (this.state === GAME_STATES.BATTLE) {
            this.battle.battleUpdate();
        }
        player.updatePlayer();
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

    arrangeState() {
        this._stage = this.stage + 1;
        this.state = GAME_STATES.ARRANGE;
        this.time = 5;
        this.sendMsgToAll("stateUpdate", {
            state: this.state,
            time: this.time,
        });
        setTimeout(() => {
            this.waitState();
        }, 5000);
    }

    waitState() {
        this.state = GAME_STATES.WAIT;
        this.time = 3;
        this.sendMsgToAll("stateUpdate", {
            state: this.state,
            time: this.time,
        });
        setTimeout(() => {
            this.battleState();
        }, 3000);

        this.battle = new Battle(this.players[0], this.players[1]);
        this.battle.battleUpdate();
    }

    battleState() {
        this.state = GAME_STATES.BATTLE;
        this.time = 20;
        this.sendMsgToAll("stateUpdate", {
            state: this.state,
            time: this.time,
        });
        setTimeout(() => {
            this.arrangeState();
        }, 20000);
    }

    sendMsgToAll(type, data) {
        this.players.forEach((player) => {
            sendMsg(player.ws, type, data);
        });
    }
}

module.exports = Game;
