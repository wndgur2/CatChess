const simpleCats = {
    normalCat: {
        type: "normalCat",
        name: "일반 고양이",
        cost: 1,
        ad: 15,
        speed: 10,
        hp: 150,
        armor: 3,
        range: 1,
    },
    fastCat: {
        type: "fastCat",
        name: "빠른 고양이",
        cost: 1,
        ad: 15,
        speed: 20,
        hp: 80,
        armor: 2,
        range: 1,
    },
    strongCat: {
        type: "strongCat",
        name: "강한 고양이",
        cost: 2,
        ad: 30,
        speed: 5,
        hp: 100,
        armor: 4,
        range: 1,
    },
    ssepCat: {
        type: "ssepCat",
        name: "쌥쌥 고양이",
        cost: 2,
        ad: 5,
        speed: 20,
        hp: 100,
        armor: 2,
        range: 3,
    },
    tankCat: {
        type: "tankCat",
        name: "탱크 고양이",
        cost: 3,
        ad: 15,
        speed: 5,
        hp: 150,
        armor: 6,
        range: 2,
    },
    adCat: {
        type: "adCat",
        name: "원딜 고양이",
        cost: 3,
        ad: 10,
        speed: 10,
        hp: 100,
        armor: 2,
        range: 4,
    },
    assasinCat: {
        type: "assasinCat",
        name: "암살자 고양이",
        cost: 4,
        ad: 100,
        speed: 10,
        hp: 10,
        armor: 1,
        range: 1,
    },
    armorCat: {
        type: "armorCat",
        name: "철갑 고양이",
        cost: 4,
        ad: 5,
        speed: 5,
        hp: 200,
        armor: 10,
        range: 1,
    },
};

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = simpleCats;
}

// ES6 Modules (browser)
if (typeof window !== "undefined") {
    window.simpleCats = simpleCats;
}
