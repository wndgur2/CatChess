const Creep = require("../Creep.js");
const CREEP_ROUNDS = {
    1: {
        id: "creep",
        level: 1,
        board: [
            [null, null, null, null, null],
            [null, null, new Creep("crab", 2, 1), null, null],
            [null, null, null, null, null],
        ],
    },
    2: {
        id: "creep",
        level: 2,
        board: [
            [
                new Creep("frog", 0, 0),
                new Creep("frog", 1, 0),
                new Creep("frog", 2, 0),
                new Creep("frog", 3, 0),
                new Creep("frog", 4, 0),
            ],
            [
                new Creep("frog", 0, 1),
                new Creep("frog", 1, 1),
                new Creep("frog", 2, 1),
                new Creep("frog", 3, 1),
                new Creep("frog", 4, 1),
            ],
            [
                new Creep("frog", 0, 2),
                new Creep("frog", 1, 2),
                new Creep("frog", 2, 2),
                new Creep("frog", 3, 2),
                new Creep("frog", 4, 2),
            ],
        ],
    },
    3: {
        id: "creep",
        level: 3,
        board: [
            [null, null, null, null, null],
            [null, null, new Creep("eel", 2, 1), null, null],
            [null, null, new Creep("crab", 2, 1), null, null],
        ],
    },
};

Object.freeze(CREEP_ROUNDS);

module.exports = CREEP_ROUNDS;
