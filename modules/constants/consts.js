const TIME_STEP = 50; // bigger is slower (a step per a TIME_STEP)
const PLAYER_NUM = 2;
const MAX_LEVEL = 6;
const DIRECTIONS = [
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
    READY: "ready",
    BATTLE: "battle",
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
    DIRECTIONS,
    MAX_LEVEL,
    SHOP_POSSIBILITIES,
};
