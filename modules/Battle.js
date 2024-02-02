const BattleField = require("./BattleField");
const { sendMsg } = require("./utils");
const { TIME_STEP } = require("./constants/CONSTS.js");
const SYNERGIES = require("./constants/SYNERGIES.js");

class Battle {
    static newId = 0;
    constructor(player1, player2, isCreep = false) {
        this.id = Battle.newId++;
        this.finished = false;
        this.game = player1.game;
        this.player1 = player1;
        this.player2 = player2;
        this.player1.battle = this;
        this.player2.battle = this;

        this.isCreep = isCreep;

        // TODO: creep이 중복된 uid를 가짐.
        let board1 = player1.board.map((row) =>
            row.map((c) => (c ? c.clone() : null))
        );

        let board2 = player2.board
            .map((row) => row.map((c) => (c ? c.clone() : null)).reverse())
            .reverse();

        this.battleField = new BattleField([...board2, ...board1]);
        player1.battle = this;
        player2.battle = this;

        this.applySynergies();

        [this.player1, this.player2].forEach((player) => {
            if (!player.ws) return;
            sendMsg(player.ws, "battleReady", {
                battleId: this.id,
                board: this.battleField.field.map((row) =>
                    row.map((c) => (c ? { ...c, battleField: null } : null))
                ),
                reversed: player === this.player2,
            });
        });
    }

    applySynergies() {
        [this.player1, this.player2].forEach((player) => {
            this.battleField.field.forEach((row) => {
                row.forEach((cat) => {
                    if (!cat) return;
                    if (!cat.synergies) return;
                    for (const [synergy, cats] of Object.entries(
                        player.synergies
                    )) {
                        if (cat.synergies.includes(synergy)) {
                            SYNERGIES[synergy].apply(cat, cats.length);
                        }
                    }
                });
            });
        });
    }

    initBattle() {
        [this.player1, this.player2].forEach((player) => {
            if (!player.ws) return;
            sendMsg(player.ws, "battleInit", {
                timeStep: TIME_STEP,
            });
        });
        this.battleInterval = setInterval(() => this.updateBattle(), TIME_STEP);
    }

    updateUnitItem(unit) {
        [this.player1, this.player2].forEach((player) => {
            if (!player.ws) return;
            sendMsg(player.ws, "unitItemUpdate", {
                battleId: this.id,
                unit: { ...unit, battleField: null },
            });
        });
    }

    updateBattle() {
        let p1Cats = this.battleField.getCats(this.player1.id);
        let p2Cats = this.battleField.getCats(this.player2.id);
        const units = [...p1Cats, ...p2Cats];

        // random shuffle
        for (let i = units.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [units[i], units[j]] = [units[j], units[i]];
        }

        if (p1Cats.length > 0 && p2Cats.length > 0)
            units.forEach((c) => c.update());
        else this.finish();
    }

    finish() {
        if (this.fisnished) return;
        clearInterval(this.battleInterval);

        let p1Units = this.battleField.getCats(this.player1.id).length,
            p2Units = this.battleField.getCats(this.player2.id).length,
            damage;

        if (p1Units > p2Units) {
            if (!this.isCreep) {
                this.player1._money++;
                this.player1._winning++;
                this.player2._losing++;
            }
            damage = p1Units - p2Units + this.player1.level;
            this.player2.hp -= damage;
        } else if (p1Units < p2Units) {
            if (!this.isCreep) {
                this.player2._money++;
                this.player2._winning++;
                this.player1._losing++;
            }
            damage = p2Units - p1Units + this.player2.level;
            this.player1.hp -= damage;
        } else {
            this.player1._losing++;
            this.player2._losing++;
            this.player2.hp -= this.player1.level;
            this.player1.hp -= this.player2.level;
        }

        [this.player1, this.player2].forEach((player) => {
            this.game.sendMsgToAll("hpUpdate", {
                player: player.id,
                hp: player.hp,
            });
        });

        this.fisnished = true;

        if (
            Object.entries(this.game.battles).every(
                ([_, battle]) => battle.fisnished
            )
        )
            this.game.finishState();
    }
}

module.exports = Battle;
