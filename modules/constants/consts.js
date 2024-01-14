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

module.exports = { GAME_STATES, TIME_STEP, PLAYER_NUM, DIRS, MAX_LEVEL };
