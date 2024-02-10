const CREEP_ROUNDS = {
    1: [
        [null, null, null, null, null],
        [null, null, "crab", null, null],
        [null, null, null, null, null],
    ],
    2: [
        [null, null, "crab", null, null],
        [null, null, null, null, null],
        [null, , "eel", null, null],
    ],
    3: [
        ["frog", "frog", "frog", "frog", "frog"],
        ["frog", "frog", "frog", "frog", "frog"],
        [null, null, null, null, null],
    ],
    4: [
        [null, "crab", null, "crab", null],
        [null, null, null, null, null],
        ["eel", null, "eel", null, "eel"],
    ],
    5: [
        [null, null, null, null, null],
        [null, null, "zara", null, null],
        [null, null, null, null, null],
    ],
};

Object.freeze(CREEP_ROUNDS);

module.exports = CREEP_ROUNDS;
