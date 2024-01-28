const Creep = require("../unit/Creep.js");
const CREEP_ROUNDS = {
    1: {
        id: "creep",
        level: 1,
        board: [
            [null, null, null, null, null],
            [null, null, new Creep("crab"), null, null],
            [null, null, null, null, null],
        ],
    },
    2: {
        id: "creep",
        level: 2,
        board: [
            [null, null, new Creep("crab"), null, null],
            [null, null, null, null, null],
            [null, , new Creep("eel"), null, null],
        ],
    },
    3: {
        id: "creep",
        level: 3,
        board: [
            [
                new Creep("frog"),
                new Creep("frog"),
                new Creep("frog"),
                new Creep("frog"),
                new Creep("frog"),
            ],
            [
                new Creep("frog"),
                new Creep("frog"),
                new Creep("frog"),
                new Creep("frog"),
                new Creep("frog"),
            ],
            [null, null, null, null, null],
        ],
    },
    4: {
        id: "creep",
        level: 4,
        board: [
            [null, new Creep("crab"), null, new Creep("crab"), null],
            [null, null, null, null, null],
            [new Creep("eel"), null, new Creep("eel"), null, new Creep("eel")],
        ],
    },
    5: {
        id: "creep",
        level: 5,
        board: [
            [null, null, null, null, null],
            [null, null, new Creep("zara"), null, null],
            [null, null, null, null, null],
        ],
    },
};

Object.freeze(CREEP_ROUNDS);

module.exports = CREEP_ROUNDS;
