const CREEPS = {
    crab: {
        id: "crab",
        name: "게",
        cost: 1,
        ad: 10,
        speed: 10,
        hp: 90,
        armor: 3,
        range: 1,
    },
    eel: {
        id: "eel",
        name: "뱀장어",
        cost: 2,
        ad: 20,
        speed: 25,
        hp: 65,
        armor: 1,
        range: 3,
    },
    frog: {
        id: "frog",
        name: "개구리",
        cost: 1,
        ad: 26,
        speed: 49,
        hp: 10,
        armor: 0,
        range: 1,
    },
    zara: {
        id: "zara",
        name: "자라",
        cost: 1,
        ad: 48,
        speed: 10,
        hp: 10000,
        armor: 10,
        range: 1,
    },
};

Object.freeze(CREEPS);
module.exports = CREEPS;
