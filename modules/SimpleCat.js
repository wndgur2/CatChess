const Player = require("./Player");
const simpleCats = require("./simpleCats");

class SimpleCat {
    static catTypes = Object.values(simpleCats);
    /**
     *
     * @param {*} id
     * @param {Player} player
     */
    constructor(id, player, tier, x, y = 3) {
        const type = SimpleCat.catTypes[id];

        this.tier = tier;
        this.name = type.name;
        this.ad = type.ad * tier;
        this.speed = type.speed * tier;
        this.hp = type.hp * toer;
        this.armor = type.armor * tier;
        this.price = type.price * Math.pow(3, tier - 1);
        if (tier > 1) this.price -= 1;

        this.x = x;
        this.y = y;
        this.owner = player;

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
