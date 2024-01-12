const Field = require("./Field");
const Game = require("./Game");
const Player = require("./Player");
const { sendMsg } = require("./utils");
const { TIME_STEP } = require("./constants/CONSTS.js");

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

        this.field = new Field([...board2, ...board1]);

        this.players.forEach((player) => {
            if (!player.ws) return;
            sendMsg(player.ws, "battleUpdate", {
                board: this.field.board.map((row) =>
                    row.map((c) => (c ? { ...c, field: null } : null))
                ),
                reversed: player === this.player2,
            });
        });
    }

    initBattle() {
        this.battleInterval = setInterval(() => {
            this.updateBattle();
        }, TIME_STEP);
    }

    updateBattle() {
        let p1Cats = this.field.getCats(this.player1.id);
        let p2Cats = this.field.getCats(this.player2.id);
        if (p1Cats.length > 0 && p2Cats.length > 0) {
            [...p1Cats, ...p2Cats].forEach((c) => {
                let res = c.action();
                if (!res) return;

                this.players.forEach((p) => {
                    if (!p.ws) return;
                    res.data.reversed = p === this.player2;
                    sendMsg(p.ws, res.type, res.data);
                });
            });
        } else this.finish();
    }

    finish() {
        clearInterval(this.battleInterval);

        let p1Units = this.field.getCats(this.player1.id).length,
            p2Units = this.field.getCats(this.player2.id).length,
            damage;

        if (p1Units > p2Units) {
            if (!this.isCreep) {
                this.player1._money = this.player1.money + 1;
                this.player1._winning++;
                this.player1._losing = 0;
                this.player2._losing++;
                this.player2._winning = 0;
            }
            damage = p1Units - p2Units + this.player1.level;
            this.player2.hp -= damage * 5;
        } else if (p1Units < p2Units) {
            if (!this.isCreep) {
                this.player2._winning++;
                this.player2._losing = 0;
                this.player1._losing++;
                this.player1._winning = 0;
            }
            damage = p2Units - p1Units + this.player2.level;
            this.player1.hp -= damage * 5;
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
