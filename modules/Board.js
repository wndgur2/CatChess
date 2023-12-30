class Board {
    static dir = [
        [
            // 짝수 y
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [-1, 1],
            [-1, -1],
        ],
        [
            // 홀수 y
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [1, -1],
            [1, 1],
        ],
    ];

    constructor(board) {
        this.board = board;
        this.catsOfPlayer = {};
        this.board.forEach((row, i) => {
            row.forEach((c, j) => {
                if (c) {
                    c.board = this;
                    c.y = i;
                    c.x = j;
                    c.hp = c.maxHp;
                    c.delay = 0;
                }
            });
        });
    }

    getNextMove(cat, target) {
        // search fastest path from cat to target. other ally cats are obstacles.
        let visited = [];
        this.board.forEach((row) => {
            visited.push(row.map((c) => c !== null && c.owner === cat.owner));
        });
        let queue = [];
        queue.push([cat.y, cat.x, [(cat.y, cat.x)]]);
        visited[cat.y][cat.x] = true;
        while (queue.length > 0) {
            let [y, x, path] = queue.shift();
            if (y === target.y && x === target.x) {
                return path[1];
            }
            Board.dir[y % 2].forEach(([dy, dx]) => {
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
        // find nearest enemy and return {dist, cat}
        let visited = [];
        this.board.forEach((row) => {
            visited.push(row.map((_) => false));
        });
        let queue = [];
        queue.push([cat.y, cat.x, 0]);
        visited[cat.y][cat.x] = true;
        while (queue.length > 0) {
            let [y, x, dist] = queue.shift();
            if (this.board[y][x] && this.board[y][x].owner !== cat.owner) {
                return { dist, target: this.board[y][x] };
            }
            Board.dir[y % 2].forEach(([dy, dx]) => {
                let ny = y + dy,
                    nx = x + dx;
                if (ny < 0 || ny >= 6 || nx < 0 || nx >= 5) return;
                if (visited[ny][nx]) return;
                visited[ny][nx] = true;
                queue.push([ny, nx, dist + 1]);
            });
        }

        console.log("no enemy left.");
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
        } else {
            this.board.forEach((row) => {
                row.forEach((cat) => {
                    if (cat && cat.owner === playerId) res.push(cat);
                });
            });
        }
        return res;
    }
}

module.exports = Board;
