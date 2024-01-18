const COORDINATES = {
    BOARD: [],
    ALLY_QUEUE: [],
    ENEMY_QUEUE: [],
};

const PLATE_RADIUS = 18;
const PLATE_WIDTH = PLATE_RADIUS * Math.sqrt(3);
const PLATE_DEPTH = (3 / 2) * PLATE_RADIUS;
const PLATE_HEIGHT = 120;
const PLATE_GAP = 1;
for (let i = 5; i >= 0; i--) {
    COORDINATES.BOARD.push([]);
    for (let j = 4; j >= 0; j--) {
        const coord = [0, 0, 0];
        coord[0] =
            j * (PLATE_WIDTH + PLATE_GAP) -
            (4.5 * (PLATE_WIDTH + PLATE_GAP)) / 2;
        coord[1] = -PLATE_HEIGHT / 2;
        coord[2] =
            i * (PLATE_DEPTH + PLATE_GAP) - (5 * (PLATE_DEPTH + PLATE_GAP)) / 2;
        if (i % 2 == 0) coord[0] += (PLATE_WIDTH + PLATE_GAP) / 2;
        COORDINATES.BOARD[5 - i].push(coord);
    }
}

const BOX_WIDTH = 28;
const BOX_DEPTH = 28;
const BOX_HEIGHT = 120;
const BOX_GAP = 1;
for (let i = 6; i >= 0; i--) {
    const coord = [0, 0, 0];
    coord[0] = i * (BOX_WIDTH + BOX_GAP) - (6 * (BOX_WIDTH + BOX_GAP)) / 2;
    coord[1] = -BOX_HEIGHT / 2;
    coord[2] = -1 * ((PLATE_DEPTH + PLATE_GAP) * 3.5 + BOX_DEPTH / 4);
    COORDINATES.ALLY_QUEUE.push(coord);
}
for (let i = 6; i >= 0; i--) {
    const coord = [0, 0, 0];
    coord[0] = i * (BOX_WIDTH + BOX_GAP) - (6 * (BOX_WIDTH + BOX_GAP)) / 2;
    coord[1] = -BOX_HEIGHT / 2;
    coord[2] = (PLATE_DEPTH + PLATE_GAP) * 3.5 + BOX_DEPTH / 4;
    COORDINATES.ENEMY_QUEUE.push(coord);
}

Object.freeze(COORDINATES);

export {
    COORDINATES,
    PLATE_RADIUS,
    PLATE_WIDTH,
    PLATE_HEIGHT,
    BOX_WIDTH,
    BOX_DEPTH,
    BOX_HEIGHT,
};
