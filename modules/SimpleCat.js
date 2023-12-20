const Player = require("./Player");
const simpleCats = require("./simpleCats");

class SimpleCat {
    static catTypes = simpleCats;
    static catTypeValues = Object.values(SimpleCat.catTypes);

    static getRandomCatTypeByCost(cost) {
        let candidates = SimpleCat.catTypeValues.filter(
            (cat) => cat.cost === cost
        );
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * @param {Player} player
     */
    constructor(typeI, player, x, y = 3, tier = 1) {
        this.type = SimpleCat.catTypes[typeI];

        this.tier = tier;
        this.name = this.type.name;
        this.ad = this.type.ad * tier;
        this.speed = this.type.speed * tier;
        this.range = this.type.range;
        this.hp = this.type.hp * tier;
        this.armor = this.type.armor * tier;
        this.cost = this.type.cost * Math.pow(3, tier - 1);
        if (tier > 1) this.cost -= 1;

        this.x = x;
        this.y = y;
        this.owner = player.id;

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
