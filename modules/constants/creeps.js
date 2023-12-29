const SimpleCat = require("../SimpleCat.js");

const creep = {
    id: "creep",
    level: 1,
    hp: 100,
};

const creeps = {
    1: {
        id: "creep",
        level: 1,
        hp: 100,
        board: [
            [null, null, null, null, null],
            [null, null, new SimpleCat("wildCat", creep, 2, 1), null, null],
            [null, null, null, null, null],
        ],
    },
    2: {
        id: "creep",
        level: 2,
        hp: 100,
        board: [
            [null, null, null, null, null],
            [
                null,
                new SimpleCat("wildCat", creep, 2, 1),
                null,
                new SimpleCat("thiefCat", creep, 2, 1),
                null,
            ],
            [null, null, null, null, null],
        ],
    },
};

Object.freeze(creeps);

module.exports = creeps;
