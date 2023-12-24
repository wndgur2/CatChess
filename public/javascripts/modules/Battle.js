class Battle {
    static board = [];
    static displayBoard() {
        let rows = document.getElementsByClassName("row");
        for (let i = 0; i < rows.length; i++) {
            let cells = rows[i].getElementsByClassName("cell");
            for (let j = 0; j < cells.length; j++) {
                if (Battle.board[i][j])
                    cells[j].innerHTML = Battle.board[i][j].display();
                else cells[j].innerHTML = "";
            }
        }
    }
}
export default Battle;
