const TIME_STEP = 50;
const PLAYER_NUM = 2;
const MAX_LEVEL = 6;
const DIRS = [
    [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
    ],
    [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [-1, -1],
        [1, -1],
    ],
];
const GAME_STATES = {
    ARRANGE: "arrange",
    BATTLE: "battle",
    READY: "ready",
    FINISH: "finish",
};
const SHOP_POSSIBILITIES = [
    [100, 0, 0, 0],
    [100, 0, 0, 0],
    [75, 25, 0, 0],
    [50, 30, 20, 0],
    [30, 40, 25, 5],
    [15, 25, 35, 25],
];

module.exports = {
    GAME_STATES,
    TIME_STEP,
    PLAYER_NUM,
    DIRS,
    MAX_LEVEL,
    SHOP_POSSIBILITIES,
};
