const Unit = require("./Unit");
const CATS = require("../constants/CATS");

class SimpleCat extends Unit {
    static prototypes = CATS;

    static getRandomCatTypeByCost(cost) {
        let candidates = Object.values(SimpleCat.prototypes).filter(
            (cat) => cat.cost === cost
        );
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    constructor(id, player, x, y, tier = 1) {
        super(SimpleCat.prototypes[id], player.id, x, y, tier);
    }
}

module.exports = SimpleCat;
