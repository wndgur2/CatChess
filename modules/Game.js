const { sendMsg, getPlayerById, removePlayer } = require("./utils.js");
const { GAME_STATES, PLAYER_NUM, TESTING } = require("./constants/CONSTS.js");
const CREEP_ROUNDS = require("./constants/CREEP_ROUNDS.js");
const Player = require("./Player.js");
const Battle = require("./Battle.js");
const Creep = require("./unit/Creep.js");

class Game {
    static matchingPlayers = [];
    /**
     * @type {Game[]} games
     */
    static games = [];
    static startMatching(from, ws) {
        if (Game.matchingPlayers.find((player) => player.id === from)) return;
        let player = getPlayerById(from);
        if (player) {
            player.ws = ws;
            // 재접속
            if (player.game) {
                sendMsg(ws, "gameMatched", {
                    players: player.game.players.map((p) => p.id),
                });
                player.game.sendGameData(from);
                return;
            }
        } else {
            player = new Player(from, ws);
        }

        Game.matchingPlayers.push(player);
        if (Game.matchingPlayers.length === PLAYER_NUM) {
            Game.matchingPlayers.forEach((player) => {
                sendMsg(player.ws, "areYouReady", {});
            });

            // TODO: confirm all players are ready

            new Game(Game.matchingPlayers.splice(0, PLAYER_NUM));
        }
    }

    static cancelMatching(pid) {
        console.log("cancelMatching", pid);
        let player = getPlayerById(pid);
        let i = Game.matchingPlayers.indexOf(player);
        if (player && i >= 0) Game.matchingPlayers.splice(i, 1);
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
            player.updatePlayer();
        });

        this.creeps = [];
        this.players.forEach((_, i) => {
            this.creeps.push(new Player(`creep-${i}`));
            this.creeps[i].init();
            this.creeps[i].game = this;
        });
        this.round = 1;
        this.stage = 0;
        this.arrangeState();
        this.timer = setInterval(() => {
            if (this.time <= 0) return;
            this.time = this.time - 1;
            this.sendMsgToAll("timeUpdate", {
                time: this.time,
            });
        }, 1000);
    }

    sendGameData(from) {
        let player = getPlayerById(from);
        this.updateState();
        this.updateStage();

        if (this.state !== GAME_STATES.ARRANGE)
            this.battles.forEach((battle) => battle.updateBattle());
        player.updatePlayer();
    }

    set _stage(newStage) {
        if (newStage === 6) {
            this.round++;
            newStage = 1;
        }
        this.stage = newStage;
        this.updateStage();
    }

    // 게임 진행: arrange -> ready -> battle -> finish -> arrange
    arrangeState() {
        clearTimeout(this.timeout);

        this.battles = [];

        this._stage = this.stage + 1;
        this.state = GAME_STATES.ARRANGE;
        this.time = TESTING ? 12 : 20;
        this.updateState();

        // 결과 지급, 리로드
        this.players.forEach((player) => {
            player.checkUpgrade();
            player.reward();
        });

        this.timeout = setTimeout(() => {
            this.readyState();
        }, this.time * 1000);
    }

    readyState() {
        clearTimeout(this.timeout);

        // put units
        this.players.forEach((player) => {
            // count cats
            let catN = 0;
            player.board.forEach((row) => {
                row.forEach((cell) => {
                    if (cell) catN++;
                });
            });

            while (catN < player.level) {
                let c = player.queue.find((cat) => cat != null);
                if (!c) break;
                let nextX, nextY;
                do {
                    nextX = Math.floor(Math.random() * 5);
                    nextY = Math.floor(Math.random() * 3);
                } while (player.board[nextY][nextX] != null);
                player.putCat(c.uid, {
                    x: nextX,
                    y: nextY,
                });
                catN++;
            }
        });

        this.state = GAME_STATES.READY;
        this.time = 3;
        this.updateState();

        this.timeout = setTimeout(() => {
            this.battleState();
        }, this.time * 1000);

        if (this.stage == 1 && this.round <= Object.keys(CREEP_ROUNDS).length) {
            this.players.forEach((player, i) => {
                this.creeps[i].level = this.round;
                this.creeps[i].board = CREEP_ROUNDS[this.round].map((row) =>
                    row.map((c) => {
                        if (!c) return null;
                        return new Creep(c, this.creeps[i].id);
                    })
                );
                this.battles.push(new Battle(player, this.creeps[i], true));
            });
        } else {
            this.battles.push(new Battle(this.players[0], this.players[1]));
        }
    }

    battleState() {
        clearTimeout(this.timeout);

        this.state = GAME_STATES.BATTLE;
        this.time = 30;
        this.updateState();

        this.battles.forEach((battle) => battle.initBattle());
        this.timeout = setTimeout(() => this.finishState(), this.time * 1000);
    }

    finishState() {
        clearTimeout(this.timeout);

        this.state = GAME_STATES.FINISH;
        this.time = 1;
        this.updateState();

        this.battles.forEach((battle) => battle.finish());

        let isEnd = false;
        this.players.forEach((player) => {
            if (player.hp <= 0) isEnd = true;
        });

        if (isEnd)
            this.timeout = setTimeout(() => this.endState(), this.time * 1000);
        else
            this.timeout = setTimeout(
                () => this.arrangeState(),
                this.time * 1000
            );
    }

    endState() {
        clearTimeout(this.timeout);
        clearInterval(this.timer);

        this.sendMsgToAll("gameEnd", {
            winner:
                this.players[0].hp > 0
                    ? this.players[0].id
                    : this.players[1].id,
        });

        this.players.forEach((player) => {
            player.game = null;
            removePlayer(player.id);
        });

        this.creeps.forEach((creep) => {
            creep.game = null;
            removePlayer(creep.id);
        });

        Game.games.splice(Game.games.indexOf(this), 1);

        delete this.players;
        delete this;
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

    updateStage() {
        this.sendMsgToAll("stageUpdate", {
            round: this.round,
            stage: this.stage,
        });
    }
}

module.exports = Game;
