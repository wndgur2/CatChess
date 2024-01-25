const CATS = {
    wildCat: {
        id: "wildCat",
        name: "길 고양이",
        desc: "description of wildCat.",
        cost: 1,
        ad: 10,
        speed: 13,
        hp: 100,
        armor: 3,
        range: 1,
    },
    thiefCat: {
        id: "thiefCat",
        name: "도둑 고양이",
        desc: "description of thiefCat.",
        cost: 1,
        ad: 14,
        speed: 16,
        hp: 70,
        armor: 1,
        range: 1,
    },
    arherCat: {
        id: "arherCat",
        name: "궁수 고양이",
        desc: "description of arherCat.",
        cost: 1,
        ad: 10,
        speed: 13,
        hp: 70,
        armor: 1,
        range: 3,
    },
    fatCat: {
        id: "fatCat",
        name: "비만 고양이",
        desc: "description of fatCat.",
        cost: 2,
        ad: 25,
        speed: 6,
        hp: 250,
        armor: 2,
        range: 1,
    },
    strongCat: {
        id: "strongCat",
        name: "강한 고양이",
        desc: "description of strongCat.",
        cost: 2,
        ad: 25,
        speed: 12,
        hp: 130,
        armor: 3,
        range: 1,
    },
    longCat: {
        id: "longCat",
        name: "롱다리 고양이",
        desc: "description of longCat.",
        cost: 2,
        ad: 10,
        speed: 35,
        hp: 100,
        armor: 1,
        range: 3,
    },
    tankCat: {
        id: "tankCat",
        name: "탱크 고양이",
        desc: "description of tankCat.",
        cost: 3,
        ad: 15,
        speed: 8,
        hp: 150,
        armor: 8,
        range: 2,
    },
    adCat: {
        id: "adCat",
        name: "원딜 고양이",
        desc: "description of adCat.",
        cost: 3,
        ad: 17,
        speed: 20,
        hp: 100,
        armor: 1,
        range: 4,
    },
    assassinCat: {
        id: "assassinCat",
        name: "암살자 고양이",
        desc: "description of assasinCat.",
        cost: 4,
        ad: 100,
        speed: 20,
        hp: 30,
        armor: 0,
        range: 1,
    },
    armorCat: {
        id: "armorCat",
        name: "철갑 고양이",
        desc: "description of armorCat.",
        cost: 4,
        ad: 15,
        speed: 5,
        hp: 200,
        armor: 18,
        range: 1,
    },
};
Object.freeze(CATS);
module.exports = CATS;
