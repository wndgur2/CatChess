const COORDINATES = {
    BOARD: [],
    ALLY_QUEUE: [],
    ENEMY_QUEUE: [],
};

const PLATE_RADIUS = 2;
const PLATE_WIDTH = PLATE_RADIUS * Math.sqrt(3);
const PLATE_DEPTH = (3 / 2) * PLATE_RADIUS;
const PLATE_HEIGHT = PLATE_RADIUS / 4;
const PLATE_GAP = PLATE_RADIUS / 18;
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

const BOX_WIDTH = PLATE_RADIUS * 1.5;
const BOX_DEPTH = PLATE_RADIUS * 1.5;
const BOX_HEIGHT = PLATE_HEIGHT;
const BOX_GAP = BOX_WIDTH / 18;
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

const CAT_HEIGHT = PLATE_RADIUS / 2;

const HEALTHBAR_WIDTH = PLATE_RADIUS * 1.5;
const HEALTHBAR_HEIGHT = PLATE_RADIUS / 3;

const ITEM_GAP = HEALTHBAR_WIDTH / 60;
const ITEM_WIDTH = HEALTHBAR_WIDTH / 3 - ITEM_GAP;
const ITEM_DEPTH = HEALTHBAR_HEIGHT / 10;

export {
    COORDINATES,
    PLATE_RADIUS,
    PLATE_WIDTH,
    PLATE_HEIGHT,
    BOX_WIDTH,
    BOX_DEPTH,
    BOX_HEIGHT,
    CAT_HEIGHT,
    HEALTHBAR_WIDTH,
    HEALTHBAR_HEIGHT,
    ITEM_WIDTH,
    ITEM_DEPTH,
    ITEM_GAP,
};
