const Board = require("./Board");
const Game = require("./Game");
const Player = require("./Player");
const { sendMsg } = require("./utils");
const { TIME_STEP } = require("./constants/consts.js");

class Battle {
    /**
     * @param {Player} player1
     * @param {Player} player2
     */
    constructor(player1, player2, isCreep = false) {
        /**
         * @type {Game}
         */
        this.game = player1.game;
        this.player1 = player1;
        this.player2 = player2;
        this.players = [player1, player2];
        this.isCreep = isCreep;

        let board1 = player1.board.map((row) =>
            row.map((c) => (c ? c.clone() : null))
        );
        let board2 = player2.board
            .map((row) => row.map((c) => (c ? c.clone() : null)).reverse())
            .reverse();

        this.board = new Board([...board2, ...board1]);
        this.sendBattle();
    }

    initBattle() {
        this.battleInterval = setInterval(() => {
            this.updateBattle();
        }, TIME_STEP);
    }

    updateBattle() {
        let p1Cats = this.board.getCats(this.player1.id);
        let p2Cats = this.board.getCats(this.player2.id);
        if (p1Cats.length > 0 && p2Cats.length > 0) {
            // 죽일때마다 줄어서 확인해야함
            [...p1Cats, ...p2Cats].forEach((c) => c.action());
            this.sendBattle();
        } else this.finish();
    }

    sendBattle() {
        // => board update in Board?
        this.players.forEach((player) => {
            if (!player.ws) return;
            sendMsg(player.ws, "battleUpdate", {
                board: this.board.board.map((row) =>
                    row.map((c) => (c ? { ...c, board: null } : null))
                ),
                reversed: player === this.player2,
            });
        });
    }

    finish() {
        clearInterval(this.battleInterval);

        let p1Units = this.board.getCats(this.player1.id).length,
            p2Units = this.board.getCats(this.player2.id).length;

        if (p1Units > p2Units) {
            if (!this.isCreep) {
                this.player1._money = this.player1.money + 1;
                this.player1._winning++;
                this.player1._losing = 0;
                this.player2._losing++;
                this.player2._winning = 0;
            }

            this.player2.hp -= p1Units - p2Units + this.player1.level;
        } else if (p1Units < p2Units) {
            if (!this.isCreep) {
                this.player2._winning++;
                this.player2._losing = 0;
                this.player1._losing++;
                this.player1._winning = 0;
            }

            this.player1.hp -= p2Units - p1Units + this.player2.level;
        } else {
            this.players.forEach((player) => {
                if (player.id) {
                    player.winning = 0;
                    player.losing++;
                    player.hp -= 3;
                }
            });
        }

        this.players.forEach((player) => {
            if (player.id)
                this.game.sendMsgToAll("hpUpdate", {
                    player: player.id,
                    hp: player.hp,
                });
        });

        this.game.battles = this.game.battles.filter(
            (battle) => battle !== this
        );

        if (this.game.battles.length === 0) {
            this.game.finishState();
        }
    }
}

module.exports = Battle;
