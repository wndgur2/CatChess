const { DIRECTIONS } = require("./constants/CONSTS.js");

class BattleField {
    constructor(board) {
        this.board = board;
        this.catsOfPlayer = {};
        this.board.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell == null) return;
                cell.battleField = this;
                cell.y = i;
                cell.x = j;
                cell.hp = cell.maxHp;
                cell.delay = 0;
            });
        });
    }

    getNextMove(cat, target) {
        let visited = [];
        this.board.forEach((row) =>
            visited.push(row.map((c) => c !== null && c.owner === cat.owner))
        );
        let queue = [];
        queue.push([cat.y, cat.x, [(cat.y, cat.x)]]);
        visited[cat.y][cat.x] = true;

        while (queue.length > 0) {
            let [y, x, path] = queue.shift();

            if (y === target.y && x === target.x) return path[1];

            DIRECTIONS[y % 2].forEach(([dy, dx]) => {
                let ny = y + dy,
                    nx = x + dx;
                if (ny < 0 || ny >= 6 || nx < 0 || nx >= 5) return;
                if (visited[ny][nx]) return;
                visited[ny][nx] = true;
                queue.push([ny, nx, [...path, [ny, nx]]]);
            });
        }
    }

    getNearestEnemy(cat) {
        let visited = [];
        this.board.forEach((row) => {
            visited.push(row.map((_) => false));
        });
        let queue = [];
        queue.push([cat.y, cat.x, 0]);
        visited[cat.y][cat.x] = true;

        while (queue.length > 0) {
            let [y, x, distance] = queue.shift();
            if (this.board[y][x] && this.board[y][x].owner !== cat.owner)
                return { distance, target: this.board[y][x] };
            DIRECTIONS[y % 2].forEach(([dy, dx]) => {
                let ny = y + dy,
                    nx = x + dx;
                if (ny < 0 || ny >= 6 || nx < 0 || nx >= 5) return;
                if (visited[ny][nx]) return;
                visited[ny][nx] = true;
                queue.push([ny, nx, distance + 1]);
            });
        }

        console.log("getNearestEnemy(cat): no enemy left.");
    }

    getCats(playerId = null) {
        let res = [];
        if (playerId == null) {
            this.board.forEach((row) => {
                row.forEach((cat) => {
                    if (cat) res.push(cat);
                });
            });
            return res;
        }

        this.board.forEach((row) => {
            row.forEach((cat) => {
                if (cat && cat.owner === playerId) res.push(cat);
            });
        });
        return res;
    }
}

module.exports = BattleField;
