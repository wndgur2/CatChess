const Creep = require("../unit/Creep.js");
const CREEP_ROUNDS = {
    1: {
        level: 1,
        board: [
            [null, null, null, null, null],
            [null, null, "crab", null, null],
            [null, null, null, null, null],
        ],
    },
    2: {
        level: 2,
        board: [
            [null, null, "crab", null, null],
            [null, null, null, null, null],
            [null, , "eel", null, null],
        ],
    },
    3: {
        level: 3,
        board: [
            ["frog", "frog", "frog", "frog", "frog"],
            ["frog", "frog", "frog", "frog", "frog"],
            [null, null, null, null, null],
        ],
    },
    4: {
        level: 4,
        board: [
            [null, "crab", null, "crab", null],
            [null, null, null, null, null],
            ["eel", null, "eel", null, "eel"],
        ],
    },
    5: {
        level: 5,
        board: [
            [null, null, null, null, null],
            [null, null, "zara", null, null],
            [null, null, null, null, null],
        ],
    },
};

Object.freeze(CREEP_ROUNDS);

module.exports = CREEP_ROUNDS;
