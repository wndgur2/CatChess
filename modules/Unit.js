const Item = require("./Item");
const { getPlayer } = require("./utils");

class Unit {
    constructor(proto, playerId, x, y, tier) {
        this.proto = proto;
        this.id = proto.id;

        this.tier = tier;
        const magnifier = Math.sqrt(this.tier).toPrecision(2);

        this.name = this.proto.name;
        this.ad = parseInt(this.proto.ad * magnifier);
        this.speed = parseInt(this.proto.speed * magnifier);
        this.range = this.proto.range;
        this.maxHp = parseInt(this.proto.hp * magnifier);
        this.hp = this.maxHp;
        this.armor = parseInt(this.proto.armor * magnifier);
        this.cost = this.proto.cost * Math.pow(3, tier - 1);
        if (tier > 1) this.cost -= 1;

        this.items = [];

        this.x = x;
        this.y = y;
        this.owner = playerId;
        this.die = false;
        this.battleField = null;
        this.delay = 0;
    }

    action() {
        if (this.die) return;
        let res = this.battleField.getNearestEnemy(this);
        if (!res) return;
        let { dist, target } = res;
        if (dist <= this.range) return this.attack(target);
        else return this.move(this.battleField.getNextMove(this, target));
    }

    attack(target) {
        if (this.delay > 0) {
            this.delay -= this.speed;
            return;
        }
        if (this.ad - target.armor > 0) target.hp -= this.ad - target.armor;
        if (target.hp <= 0) {
            target.die = true;
            this.battleField.board[target.y][target.x] = null;
            // item drop
            if (target.owner == "creep")
                getPlayer(this.owner).pushItem(Item.getRandomItem());
        }

        this.delay += 100;
        return {
            type: "battle_attack",
            data: {
                attacker: {
                    x: this.x,
                    y: this.y,
                },
                target: {
                    x: target.x,
                    y: target.y,
                    hp: target.hp,
                },
                damage: this.ad - target.armor > 0 ? this.ad - target.armor : 0,
            },
        };
    }

    move(nextMove) {
        if (this.delay > 0) {
            this.delay -= this.speed / 2;
            return;
        }
        if (!nextMove) return;

        let y = nextMove[0],
            x = nextMove[1],
            beforeX = this.x,
            beforeY = this.y;

        this.battleField.board[this.y][this.x] = null;
        this.battleField.board[y][x] = this;
        this.y = y;
        this.x = x;
        this.delay += 100;

        return {
            type: "battle_move",
            data: {
                beforeX,
                beforeY,
                nextX: x,
                nextY: y,
            },
        };
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

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

module.exports = Unit;
