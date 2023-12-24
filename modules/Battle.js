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
        console.log(this.board);
        this.time = 0;
    }

    getBoard(player) {
        if (player === this.player1) {
            return this.board;
        } else if (player === this.player2) {
            let boardCopy = this.board.map((row) => row.slice());
            return boardCopy.map((row) => row.reverse()).reverse();
        }
    }

    battleUpdate() {
        this.players.forEach((player) => {
            sendMsg(player.ws, "battleUpdate", {
                board: this.getBoard(player),
            });
        });
    }
}

module.exports = Battle;
