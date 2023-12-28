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
        this.id = id;
        this.proto = SimpleCat.prototypes[id];

        this.tier = tier;
        this.magnyfier = Math.sqrt(this.tier).toPrecision(2);

        this.name = this.proto.name;
        this.ad = parseInt(this.proto.ad * this.magnyfier);
        this.speed = parseInt(this.proto.speed * this.magnyfier);
        this.range = this.proto.range;
        this.maxHp = parseInt(this.proto.hp * this.magnyfier);
        this.hp = this.maxHp;
        this.armor = parseInt(this.proto.armor * this.magnyfier);
        this.cost = this.proto.cost * Math.pow(3, tier - 1);
        if (tier > 1) this.cost -= 1;

        this.x = x;
        this.y = y;
        this.owner = player?.id;
        this.die = false;

        this.delay = 0;
    }

    attack() {
        if (!this.target) {
            console.log("no target");
            return;
        }
        if (this.delay > 0) {
            this.delay -= this.speed;
            return;
        }
        this.target.hp -= this.ad - this.target.armor;
        if (this.target.hp <= 0) {
            this.target.die = true;
            return;
        }
        this.delay = 100;
    }

    move(board) {
        if (this.delay > 0) {
            this.delay -= this.speed;
            return;
        }
        if (!this.target) return;
        // move toward this.target
        let nextX = this.x,
            nextY = this.y;
        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        if (dx === 0 && dy === 0) return;
        if (dx < 0 && dy < 0) {
            nextX -= 1;
            nextY -= 1;
        } else if (dx < 0 && dy > 0) {
            nextX -= 1;
            nextY += 1;
        } else {
            let dist = Math.sqrt(dx * dx + dy * dy);
            nextX += Math.round(dx / dist);
            nextY += Math.round(dy / dist);
        }
        if (nextX < 0) nextX = 0;
        if (nextY < 0) nextY = 0;
        if (nextX > 4) nextX = 4;
        if (nextY > 5) nextY = 5;
        if (board[nextY][nextX]) return;
        board[this.y][this.x] = null;
        this.x = nextX;
        this.y = nextY;
        board[this.y][this.x] = this;
        this.delay = 100;
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

module.exports = SimpleCat;
