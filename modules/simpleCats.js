const simpleCats = {
    normalCat: {
        name: "일반 고양이",
        ad: 10,
        speed: 10,
        hp: 100,
        armor: 10,
        price: 1,
    },
    tankCat: {
        name: "탱크 고양이",
        ad: 5,
        speed: 5,
        hp: 200,
        armor: 20,
        price: 1,
    },
    fastCat: {
        name: "빠른 고양이",
        ad: 10,
        speed: 20,
        hp: 80,
        armor: 5,
        price: 2,
    },
    strongCat: {
        name: "강한 고양이",
        ad: 20,
        speed: 5,
        hp: 100,
        armor: 15,
        price: 2,
    },
};

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = simpleCats;
}

// ES6 Modules (browser)
if (typeof window !== "undefined") {
    window.simpleCats = simpleCats;
}
