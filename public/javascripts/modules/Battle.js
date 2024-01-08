class Battle {
    static board = [];

    static initBattle(reversed) {
        if (reversed)
            Battle.board = Battle.board.map((row) => row.reverse()).reverse();
    }

    static displayBoard() {
        let rows = document
            .getElementById("board")
            .getElementsByClassName("row");
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].getElementsByClassName("cell");
            for (let j = 0; j < cells.length; j++) {
                if (Battle.board[i][j])
                    cells[j].innerHTML = Battle.board[i][j].display();
                else cells[j].innerHTML = "";
            }
        }
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

    static move(befX, befY, nextX, nextY, reversed) {
        if (reversed) {
            befX = 4 - befX;
            befY = 5 - befY;
            nextX = 4 - nextX;
            nextY = 5 - nextY;
        }
        let cat = Battle.board[befY][befX];
        Battle.board[befY][befX] = null;
        Battle.board[nextY][nextX] = cat;
        cat.x = nextX;
        cat.y = nextY;
        Battle.displayBoard();
    }
}
export default Battle;
