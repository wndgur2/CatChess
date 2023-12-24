const Player = require("./Player");
const CATS = require("./constants/CATS");

class SimpleCat {
    static prototypes = CATS;

    static getRandomCatTypeByCost(cost) {
        let candidates = Object.values(SimpleCat.prototypes).filter(
            (cat) => cat.cost === cost
        );
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * @param {Player} player
     */
    constructor(id, player, x, y = 3, tier = 1) {
        this.proto = SimpleCat.prototypes[id];

        this.tier = tier;
        this.name = this.proto.name;
        this.ad = this.proto.ad * tier;
        this.speed = this.proto.speed * tier;
        this.range = this.proto.range;
        this.maxHp = this.proto.hp * tier;
        this.hp = this.maxHp;
        this.armor = this.proto.armor * tier;
        this.cost = this.proto.cost * Math.pow(3, tier - 1);
        if (tier > 1) this.cost -= 1;

        this.x = x;
        this.y = y;
        this.owner = player?.id;

        this.delay = 0;
    }

    /**
     * @param {SimpleCat} target
     */
    attack(target) {
        if (this.delay > 0) this.prepAttack();
        target.hp -= this.ad - target.armor;
        this.delay = 100;
    }

    prepAttack() {
        this.delay -= this.speed;
    }
}

module.exports = SimpleCat;
