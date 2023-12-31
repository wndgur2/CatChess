const { sendMsg } = require("./utils.js");
const { GAME_STATES, PLAYER_NUM } = require("./constants/consts.js");
const CREEP_ROUNDS = require("./constants/CREEP_ROUNDS.js");
const Battle = require("./Battle.js");
const Player = require("./Player.js");

class Game {
    static waitingPlayers = [];
    /**
     * @type {Game[]} games
     */
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
        if (Game.waitingPlayers.length >= PLAYER_NUM) {
            Game.games.push(
                new Game(Game.waitingPlayers.splice(0, PLAYER_NUM))
            );
        }
    }

    /**
     * @param {[Player]} players
     */
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
        /**
         * @type {Battle[]}
         */
        this.battles = [];
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
        this.players.forEach((player) => {
            sendMsg(ws, "hpUpdate", {
                player: player.id,
                hp: player.hp,
            });
        });

        if (this.state !== GAME_STATES.ARRANGE) {
            this.battles.forEach((battle) => {
                battle.updateBattle();
            });
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
        clearTimeout(this.timeout);

        this._stage = this.stage + 1;
        this.state = GAME_STATES.ARRANGE;
        this.time = 7;
        this.updateState();
        this.timeout = setTimeout(() => {
            this.readyState();
        }, this.time * 1000);

        // 결과 지급, 리로드
        this.players.forEach((player) => {
            player.checkUpgrade();
            player.reload(true);
            let income = 5;
            income += player.winning > 1 ? player.winning : 0;
            income += player.losing > 1 ? player.losing * 2 : 0;
            income += Math.min(parseInt(player.money / 10), 5);
            player._money = player.money + income;
            player._exp += 2;
        });
    }

    readyState() {
        clearTimeout(this.timeout);

        this.state = GAME_STATES.READY;
        this.time = 3;
        this.updateState();
        this.timeout = setTimeout(() => {
            this.battleState();
        }, this.time * 1000);

        if (this.stage == 1) {
            this.players.forEach((player) => {
                this.battles.push(
                    new Battle(player, CREEP_ROUNDS[this.round], true)
                );
            });
        } else this.battles.push(new Battle(this.players[0], this.players[1]));
    }

    battleState() {
        clearTimeout(this.timeout);

        this.state = GAME_STATES.BATTLE;
        this.battles.forEach((battle) => {
            battle.initBattle();
        });
        this.time = 30;
        this.updateState();
        this.timeout = setTimeout(() => {
            this.finishState();
        }, this.time * 1000);
    }

    finishState() {
        clearTimeout(this.timeout);

        this.battles.forEach((battle) => {
            // 이미 실행된 배틀은 제거됨.
            battle.finish();
        });

        this.state = GAME_STATES.FINISH;
        this.time = 3;
        this.updateState();
        this.timeout = setTimeout(() => {
            this.arrangeState();
        }, this.time * 1000);
    }

    sendMsgToAll(type, data) {
        this.players.forEach((player) => {
            sendMsg(player.ws, type, data);
        });
    }

    updateState() {
        this.sendMsgToAll("stateUpdate", {
            state: this.state,
            time: this.time,
        });
    }
}

module.exports = Game;
