const { sendMsg, getPlayer, removePlayer } = require("./utils.js");
const { GAME_STATES, PLAYER_NUM } = require("./constants/CONSTS.js");
const CREEP_ROUNDS = require("./constants/CREEP_ROUNDS.js");
const Player = require("./Player.js");
const Battle = require("./Battle.js");
const Creep = require("./unit/Creep.js");

class Game {
    static waitingPlayers = [];
    /**
     * @type {Game[]} games
     */
    static games = [];
    static newPlayer(from, ws) {
        if (Game.waitingPlayers.find((player) => player.id === from)) return;
        let player = getPlayer(from);
        if (player) {
            player.ws = ws;

            // 게임 데이터 전송
            let game = player.game;
            if (game && game.state !== GAME_STATES.FINISH) {
                sendMsg(ws, "gameMatched", {
                    players: game.players.map((p) => p.id),
                });
                game.sendGameData(from);
                return;
            }
        }
        Game.waitingPlayers.push(new Player(from, ws));
        if (Game.waitingPlayers.length === PLAYER_NUM)
            new Game(Game.waitingPlayers.splice(0, PLAYER_NUM));
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
        this.battles = {};
        this.timer = setInterval(() => {
            if (this.time <= 0) return;
            this.time = this.time - 1;
            this.sendMsgToAll("timeUpdate", {
                time: this.time,
            });
        }, 1000);
    }

    sendGameData(from) {
        let player = getPlayer(from);
        let ws = player.ws;
        sendMsg(ws, "stateUpdate", {
            state: this.state,
            time: this.time,
        });
        sendMsg(ws, "stageUpdate", {
            round: this.round,
            stage: this.stage,
        });

        if (this.state !== GAME_STATES.ARRANGE) {
            for (const [_, battle] of Object.entries(this.battles))
                battle.updateBattle();
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

    // 게임 진행: arrange -> ready -> battle -> finish -> arrange
    arrangeState() {
        clearTimeout(this.timeout);

        this.battles = {};

        this._stage = this.stage + 1;
        this.state = GAME_STATES.ARRANGE;
        this.time = 7;
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

        // TODO 한 creep의 battle이 여러개라 map에서 덮어씌워짐.
        // 플레이어 마다 한 크립 필요.
        if (this.stage == 1 && this.round <= Object.keys(CREEP_ROUNDS).length) {
            this.players.forEach((player, i) => {
                this.creeps[i].level = CREEP_ROUNDS[this.round].level;
                this.creeps[i].board = CREEP_ROUNDS[this.round].board.map(
                    (row) =>
                        row.map((c) => {
                            if (!c) return null;
                            return new Creep(c, this.creeps[i].id);
                        })
                );
                const newBattle = new Battle(player, this.creeps[i], true);
                this.battles[player.id] = newBattle;
            });
        } else {
            const newBattle = new Battle(this.players[0], this.players[1]);
            this.battles[this.players[0].id] = newBattle;
            this.battles[this.players[1].id] = newBattle;
        }
    }

    battleState() {
        clearTimeout(this.timeout);

        this.state = GAME_STATES.BATTLE;
        this.time = 30;
        this.updateState();

        for (const [_, battle] of Object.entries(this.battles)) {
            battle.initBattle();
        }
        this.timeout = setTimeout(() => this.finishState(), this.time * 1000);
    }

    finishState() {
        clearTimeout(this.timeout);

        this.state = GAME_STATES.FINISH;
        this.time = 1;
        this.updateState();

        // this.battles.forEach((battle) => battle.finish());
        for (const [_, battle] of Object.entries(this.battles)) {
            battle.finish();
        }

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

        this.players.forEach((player) => {
            removePlayer(player.id);
        });

        this.sendMsgToAll("gameEnd", {
            winner:
                this.players[0].hp > 0
                    ? this.players[0].id
                    : this.players[1].id,
        });

        Game.games.splice(Game.games.indexOf(this), 1);
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
