const GAME_STATES = {
    ARRANGE: "arrange",
    BATTLE: "battle",
    READY: "ready",
    FINISH: "finish",
};

Object.freeze(GAME_STATES);

const TIME_STEP = 50;
const PLAYER_NUM = 2;

module.exports = { GAME_STATES, TIME_STEP, PLAYER_NUM };
