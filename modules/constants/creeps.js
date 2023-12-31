const CREEPS = {
    eel: {
        id: "eel",
        name: "뱀장어",
        cost: 1,
        ad: 10,
        speed: 10,
        hp: 50,
        armor: 3,
        range: 2,
    },
    crab: {
        id: "crab",
        name: "게",
        cost: 2,
        ad: 20,
        speed: 20,
        hp: 90,
        armor: 5,
        range: 1,
    },
};

Object.freeze(CREEPS);
module.exports = CREEPS;
