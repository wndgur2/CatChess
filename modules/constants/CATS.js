// 현재: 중세 풍
const CATS = {
    wildCat: {
        id: "wildCat",
        name: "Wild Cat",
        synergies: ["Nature"],
        desc: "description of wildCat.",
        cost: 1,
        skill: "roar",
        ad: 10,
        speed: 13,
        hp: 150,
        armor: 3,
        range: 1,
    },
    thiefCat: {
        id: "thiefCat",
        name: "Thief Cat",
        synergies: ["Therme"],
        desc: "description of thiefCat.",
        cost: 1,
        skill: "neckBite",
        ad: 12,
        speed: 16,
        hp: 100,
        armor: 1,
        range: 1,
    },
    arherCat: {
        id: "arherCat",
        name: "Arher Cat",
        synergies: ["Poeir"],
        desc: "description of arherCat.",
        cost: 1,
        skill: "roar",
        ad: 10,
        speed: 13,
        hp: 95,
        armor: 1,
        range: 3,
    },
    fatCat: {
        id: "fatCat",
        name: "Fat Cat",
        synergies: ["Poeir"],
        desc: "description of fatCat.",
        cost: 2,
        skill: "roar",
        ad: 25,
        speed: 6,
        hp: 350,
        armor: 2,
        range: 1,
    },
    strongCat: {
        id: "strongCat",
        name: "Strong Cat",
        synergies: ["Therme"],
        desc: "description of strongCat.",
        cost: 2,
        skill: "neckBite",
        ad: 25,
        speed: 12,
        hp: 190,
        armor: 3,
        range: 1,
    },
    longCat: {
        id: "longCat",
        name: "Long Cat",
        synergies: ["Nature"],
        desc: "description of longCat.",
        cost: 2,
        skill: "roar",
        ad: 10,
        speed: 35,
        hp: 140,
        armor: 1,
        range: 3,
    },
    tankCat: {
        id: "tankCat",
        name: "Tank Cat",
        synergies: ["Poeir"],
        desc: "description of tankCat.",
        cost: 3,
        skill: "roar",
        ad: 15,
        speed: 8,
        hp: 210,
        armor: 8,
        range: 2,
    },
    adCat: {
        id: "adCat",
        name: "AD Cat",
        synergies: ["Therme"],
        desc: "description of adCat.",
        cost: 3,
        skill: "roar",
        ad: 17,
        speed: 20,
        hp: 140,
        armor: 1,
        range: 4,
    },
    catKing: {
        id: "catKing",
        name: "Cat King",
        synergies: ["Poeir"],
        desc: "description of catKing.",
        cost: 4,
        skill: "roar",
        ad: 30,
        speed: 12,
        hp: 320,
        armor: 12,
        range: 1,
    },
    unknownCat: {
        id: "unknownCat",
        name: "Unknown Cat",
        synergies: ["Nature"],
        desc: "description of unknownCat.",
        cost: 4,
        skill: "roar",
        ad: 25,
        speed: 16,
        hp: 240,
        armor: 8,
        range: 1,
    },
    assassinCat: {
        id: "assassinCat",
        name: "Assassin Cat",
        synergies: ["Therme"],
        desc: "description of assasinCat.",
        cost: 4,
        skill: "roar",
        ad: 80,
        speed: 10,
        hp: 80,
        armor: 0,
        range: 1,
    },
};
Object.freeze(CATS);
module.exports = CATS;
