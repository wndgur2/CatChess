const SimpleCat = require("./SimpleCat");
const ITEMS = require("./constants/ITEMS");

class Item {
    static getRandomItem() {
        let candidates = Object.keys(ITEMS);
        return new Item(
            candidates[Math.floor(Math.random() * candidates.length)]
        );
    }

    constructor(id) {
        let proto = ITEMS[id];
        this.id = id;
        this.name = proto.name;
        this.ad = proto.ad;
        this.hp = proto.hp;
        this.armor = proto.armor;
        this.range = proto.range;
    }

    /**
     *
     * @param {SimpleCat} cat
     */
    equip(cat) {
        this.cat = cat;
        cat.ad += this.ad;
        cat.hp += this.hp;
        cat.maxHp += this.hp;
        cat.armor += this.armor;
        cat.range += this.range;
    }
}

module.exports = Item;
