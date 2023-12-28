const SimpleCat = require("../SimpleCat.js");

const creeps = {
    1: {
        id: "creep1",
        board: [
            [null, null, null, null, null],
            [null, null, new SimpleCat("wildCat", null, 2, 1), null, null],
            [null, null, null, null, null],
        ],
    },
    2: {
        id: "creep2",
        board: [
            [null, null, null, null, null],
            [
                null,
                new SimpleCat("wildCat", null, 2, 1),
                null,
                new SimpleCat("wildCat", null, 2, 1),
                null,
            ],
            [null, null, null, null, null],
        ],
    },
};

Object.freeze(creeps);

module.exports = creeps;
