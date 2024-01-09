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
        ad: 15,
        speed: 20,
        hp: 50,
        armor: 1,
        range: 2,
    },
    frog: {
        id: "frog",
        name: "개구리",
        cost: 1,
        ad: 12,
        speed: 40,
        hp: 10,
        armor: 0,
        range: 1,
    },
};

Object.freeze(CREEPS);
module.exports = CREEPS;
