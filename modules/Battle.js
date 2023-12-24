class Battle {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = [
            ...player2.board.map((row) => row.reverse()).reverse(),
            ...player1.board,
        ];
    }

    getBoard(player) {
        if (player === this.player1) {
            return this.board;
        } else if (player === this.player2) {
            return this.board.map((row) => row.reverse()).reverse();
        }
    }
}

module.exports = Battle;
