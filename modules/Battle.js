const SimpleCat = require("./SimpleCat");
const { sendMsg } = require("./utils");

class Battle {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.players = [player1, player2];
        this.board = [
            ...player2.board.map((row) => row.reverse()).reverse(),
            ...player1.board,
        ];
    }

    initBattle() {
        this.board.forEach((row, i) => {
            row.forEach((cat, j) => {
                if (cat) {
                    cat.y = i;
                    cat.x = j;
                }
            });
        });

        setInterval(() => {
            this.updateBattle();
        }, 300);
    }

    finish() {
        let winner,
            damage,
            p1Units = 0,
            p2Units = 0;
        // TODO : calculate winner
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
    }

    getNearestEnemy(y, x) {
        let minDist = Infinity;
        let minCat = null;
        this.board.forEach((row, i) => {
            row.forEach((cat, j) => {
                if (cat === null || cat.owner === this.board[y][x].owner)
                    return;
                let dist = getDistance(cat, this.board[y][x]);
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
                    if (cat.owner === this.player1.id) isPlayer1Alive = true;
                    else isPlayer2Alive = true;
                    cat.target = this.getNearestEnemy(i, j);
                    if (getDistance(cat, cat.target) <= cat.range) {
                        cat.attack();
                        if (cat.target.die) {
                            board[cat.target.y][cat.target.x] = null;
                        }
                    } else {
                        cat.move(this.board);
                    }
                    cat.target = null;
                }
            }
        }
        // TODO : Finish if there's no cat of one player
        if (!isPlayer1Alive || !isPlayer2Alive) {
            this.finish();
        }

        // send update to players
        this.players.forEach((player) => {
            sendMsg(player.ws, "battleUpdate", {
                board: this.board,
                reversed: player === this.player2,
            });
        });
    }
}

function getDistance(cat1, cat2) {
    return Math.sqrt(
        Math.pow(cat1.x - cat2.x, 2) + Math.pow(cat1.y - cat2.y, 2)
    );
}

module.exports = Battle;
