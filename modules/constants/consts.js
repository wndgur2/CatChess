const GAME_STATES = {
    ARRANGE: "arrange",
    BATTLE: "battle",
    READY: "ready",
    FINISH: "finish",
};

Object.freeze(GAME_STATES);

const TIME_STEP = 50;
const PLAYER_NUM = 2;
const MAX_LEVEL = 6;
const DIRS = [
    [
        // 짝수 y
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
    ],
    [
        // 홀수 y
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [-1, -1],
        [1, -1],
    ],
];

module.exports = { GAME_STATES, TIME_STEP, PLAYER_NUM, DIRS, MAX_LEVEL };
