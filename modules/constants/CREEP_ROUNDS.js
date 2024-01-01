const Creep = require("../Creep.js");
const CREEP_ROUNDS = {
    1: {
        id: "creep",
        level: 1,
        board: [
            [null, null, null, null, null],
            [null, null, new Creep("eel", 2, 1), null, null],
            [null, null, null, null, null],
        ],
    },
    2: {
        id: "creep",
        level: 2,
        board: [
            [null, null, null, null, null],
            [null, null, new Creep("eel", 2, 1), null, null],
            [null, null, new Creep("crab", 2, 1), null, null],
        ],
    },
};

Object.freeze(CREEP_ROUNDS);

module.exports = CREEP_ROUNDS;
