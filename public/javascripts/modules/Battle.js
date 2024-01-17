import Painter from "./Painter.js";

class Battle {
    static board = [];

    static initBattle(reversed) {
        this.reversed = reversed;
        if (reversed)
            Battle.board = Battle.board.map((row) => row.reverse()).reverse();
        Battle.displayBoard();
    }

    static displayBoard() {
        Painter._board = Battle.board.map((row) => [...row]);
    }

    static attack(attacker, target, damage, reversed) {
        let attackerCat;
        let targetCat;
        if (reversed) {
            attackerCat = Battle.board[5 - attacker.y][4 - attacker.x];
            targetCat = Battle.board[5 - target.y][4 - target.x];
        } else {
            attackerCat = Battle.board[attacker.y][attacker.x];
            targetCat = Battle.board[target.y][target.x];
        }
        targetCat.hp = parseInt(target.hp);
        if (targetCat.hp <= 0) Battle.board[targetCat.y][targetCat.x] = null;
        Battle.displayBoard();
    }

    static move(beforeX, beforeY, nextX, nextY, reversed) {
        if (reversed) {
            beforeX = 4 - beforeX;
            beforeY = 5 - beforeY;
            nextX = 4 - nextX;
            nextY = 5 - nextY;
        }
        let cat = Battle.board[beforeY][beforeX];
        Battle.board[beforeY][beforeX] = null;
        Battle.board[nextY][nextX] = cat;
        cat.x = reversed ? 4 - nextX : nextX;
        cat.y = reversed ? 5 - nextY : nextY;
        Battle.displayBoard();
    }
}
export default Battle;
