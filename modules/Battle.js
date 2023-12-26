const SimpleCat = require("./SimpleCat");
const { sendMsg } = require("./utils");

class Battle {
    constructor(player1, player2) {
        this.game = player1.game;
        this.player1 = player1;
        this.player2 = player2;
        this.players = [player1, player2];
        // copy player2's board
        let board1 = player1.board.map((row) =>
            row.map((cat) => {
                if (cat) return cat.clone();
                else return null;
            })
        );
        let board2 = player2.board
            .map((row) =>
                row
                    .map((cat) => {
                        if (cat) return cat.clone();
                        else return null;
                    })
                    .reverse()
            )
            .reverse();

        this.board = [...board2, ...board1];
        console.log(this.board);

        this.board.forEach((row, i) => {
            row.forEach((cat, j) => {
                if (cat) {
                    cat.y = i;
                    cat.x = j;
                    cat.hp = cat.maxHp;
                    cat.delay = 0;
                }
            });
        });
        this.sendBattle();
    }

    initBattle() {
        this.battleInterval = setInterval(() => {
            this.updateBattle();
        }, 25);
    }

    finish() {
        clearInterval(this.battleInterval);

        let winner,
            damage,
            p1Units = 0,
            p2Units = 0;
        this.board.forEach((row) => {
            row.forEach((cat) => {
                if (cat) {
                    if (cat.owner === this.player1.id) {
                        p1Units++;
                    } else {
                        p2Units++;
                    }
                }
            });
        });
        if (p1Units > p2Units) {
            winner = this.player1;
            damage = p1Units - p2Units;
            this.player2.hp -= damage;
        } else if (p1Units < p2Units) {
            winner = this.player2;
            damage = p2Units - p1Units;
            this.player1.hp -= damage;
        } else {
            winner = null;
            damage = 1;
        }

        this.players.forEach((player) => {
            sendMsg(player.ws, "battleResult", {
                winner: winner?.id,
                players: this.players.map((player) => [player.id, player.hp]),
            });
        });

        this.game.battles = this.game.battles.filter(
            (battle) => battle !== this
        );
        if (this.game.battles.length === 0) {
            this.game.finishState();
        }
    }

    getNearestEnemy(y, x, team) {
        let minDist = Infinity;
        let minCat = null;
        this.board.forEach((row, i) => {
            row.forEach((cat, j) => {
                if (cat === null || cat.owner === team) return;
                let dist = getDistance(cat.x, cat.y, x, y);
                if (dist < minDist) {
                    minDist = dist;
                    minCat = cat;
                }
            });
        });
        return minCat;
    }

    updateBattle() {
        // update battle status
        let isPlayer1Alive = false;
        let isPlayer2Alive = false;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                /**
                 * @type {SimpleCat}
                 */
                let cat = this.board[i][j];
                if (cat) {
                    console.log(cat);
                    if (cat.owner === this.player1.id) isPlayer1Alive = true;
                    else isPlayer2Alive = true;
                    cat.target = this.getNearestEnemy(i, j, cat.owner);
                    if (!cat.target) break;
                    if (
                        getDistance(j, i, cat.target.x, cat.target.y) <=
                        cat.range
                    ) {
                        cat.attack();
                        if (cat.target.die) {
                            this.board[cat.target.y][cat.target.x] = null;
                        }
                    } else {
                        cat.move(this.board);
                    }
                    cat.target = null;
                }
            }
        }
        this.sendBattle();

        // TODO : Finish if there's no cat of one player
        if (!isPlayer1Alive || !isPlayer2Alive) {
            this.finish();
        }
    }

    sendBattle() {
        this.players.forEach((player) => {
            sendMsg(player.ws, "battleUpdate", {
                board: this.board,
                reversed: player === this.player2,
            });
        });
    }
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

module.exports = Battle;
