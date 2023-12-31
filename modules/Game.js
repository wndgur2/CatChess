const { sendMsg, getPlayer, removePlayer } = require("./utils.js");
const { GAME_STATES, PLAYER_NUM } = require("./constants/CONSTS.js");
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
            player.updateHp();
        });

        this.creep = new Player("creep"); // players에 creep이 여러명임
        this.creep.init();
        this.round = 1;
        this.stage = 0;
        this.arrangeState();
        /**
         * @type {Battle[]}
         */
        this.battles = [];
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

    // 게임 진행 로직: arrange -> ready -> battle -> finish -> arrange

    arrangeState() {
        clearTimeout(this.timeout);
        // 결과 지급, 리로드
        this.players.forEach((player) => {
            player.reward();
        });

        this._stage = this.stage + 1;
        this.state = GAME_STATES.ARRANGE;
        this.time = 7;
        this.updateState();
        this.timeout = setTimeout(() => {
            this.readyState();
        }, this.time * 1000);
    }

    readyState() {
        clearTimeout(this.timeout);

        this.state = GAME_STATES.READY;
        this.time = 3;
        this.updateState();
        this.timeout = setTimeout(() => {
            this.battleState();
        }, this.time * 1000);

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
                let randomBoardPosition;
                do {
                    randomBoardPosition = [
                        Math.floor(Math.random() * 3),
                        Math.floor(Math.random() * 5),
                    ];
                } while (
                    player.board[randomBoardPosition[0]][
                        randomBoardPosition[1]
                    ] != null
                );
                player.putCat({
                    befX: c.x,
                    befY: c.y,
                    nextX: randomBoardPosition[1],
                    nextY: randomBoardPosition[0],
                });
                catN++;
            }
        });

        if (this.stage == 1) {
            this.creep.level = CREEP_ROUNDS[this.round].level;
            this.creep.board = CREEP_ROUNDS[this.round].board;
            this.players.forEach((player) => {
                this.battles.push(new Battle(player, this.creep, true));
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
            // 이미 끝난 배틀은 끝난 시점에 제거됨.
            battle.finish();
        });

        this.state = GAME_STATES.FINISH;
        this.time = 3;
        this.updateState();

        let isEnd = false;
        this.players.forEach((player) => {
            if (player.hp <= 0) isEnd = true;
        });

        if (isEnd) {
            this.timeout = setTimeout(() => {
                this.endState();
            }, this.time * 1000);
        } else {
            this.timeout = setTimeout(() => {
                this.arrangeState();
            }, this.time * 1000);
        }
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
