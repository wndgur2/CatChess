const Unit = require("./Unit");
const CATS = require("./constants/CATS");

class SimpleCat extends Unit {
    static prototypes = CATS;

    static getRandomCatTypeByCost(cost) {
        let candidates = Object.values(SimpleCat.prototypes).filter(
            (cat) => cat.cost === cost
        );
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    constructor(id, player, x, y = 3, tier = 1) {
        super(SimpleCat.prototypes[id], player.id, x, y, tier);
        this.items = [];
    }

    equip(item) {
        if (this.items.length >= 3) return false;
        this.items.push(item);
        this.ad += item.ad;
        this.hp += item.hp;
        this.maxHp += item.hp;
        this.armor += item.armor;
        this.range += item.range;
        return true;
    }
}

module.exports = SimpleCat;
