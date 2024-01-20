import Painter from "./Painter.js";

class Battle {
    static board = [];

    static initBattle(reversed) {
        this.reversed = reversed;
        if (reversed)
            Battle.board = Battle.board.map((row) => row.reverse()).reverse();
        this.board.forEach((row) => {
            row.forEach((cat) => {
                if (!cat) return;
                cat.draggable = false;
            });
        });
        Battle.displayBoard();
    }

    static displayBoard() {
        Painter._board = Battle.board;
    }

    static attack(attacker, target, damage) {
        let attackerCat;
        let targetCat;
        if (this.reversed) {
            attackerCat = Battle.board[5 - attacker.y][4 - attacker.x];
            targetCat = Battle.board[5 - target.y][4 - target.x];
        } else {
            attackerCat = Battle.board[attacker.y][attacker.x];
            targetCat = Battle.board[target.y][target.x];
        }

        targetCat._hp = parseInt(target.hp);
        if (targetCat.hp <= 0) {
            targetCat.die();
            Battle.board[targetCat.y][targetCat.x] = null;
        }

        Painter.hitEffect(attacker.range > 1, targetCat, damage);
    }

    static move(beforeX, beforeY, nextX, nextY) {
        if (this.reversed) {
            let cat = Battle.board[5 - beforeY][4 - beforeX];

            cat.move(beforeX, beforeY, nextX, nextY);

            Battle.board[5 - beforeY][4 - beforeX] = null;
            Battle.board[5 - nextY][4 - nextX] = cat;

            cat.x = 4 - nextX;
            cat.y = 5 - nextY;
        } else {
            let cat = Battle.board[beforeY][beforeX];

            cat.move(beforeX, beforeY, nextX, nextY);

            Battle.board[beforeY][beforeX] = null;
            Battle.board[nextY][nextX] = cat;

            cat.x = nextX;
            cat.y = nextY;
        }
    }
}
export default Battle;
