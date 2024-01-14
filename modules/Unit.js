const Item = require("./Item");
const { getPlayer } = require("./utils");

class Unit {
    constructor(proto, playerId, x, y, tier) {
        this.proto = proto;
        this.id = proto.id;
        this.tier = tier;
        this.magnifier = Math.sqrt(this.tier).toPrecision(2);

        this.name = this.proto.name;
        this.ad = parseInt(this.proto.ad * this.magnifier);
        this.speed = parseInt(this.proto.speed * this.magnifier);
        this.range = this.proto.range;
        this.maxHp = parseInt(this.proto.hp * this.magnifier);
        this.hp = this.maxHp;
        this.armor = parseInt(this.proto.armor * this.magnifier);
        this.cost = this.proto.cost * Math.pow(3, tier - 1);
        if (tier > 1) this.cost -= 1;

        this.x = x;
        this.y = y;
        this.owner = playerId;
        this.die = false;
        this.field = null;
        this.delay = 0;
    }

    action() {
        if (this.die) return;
        let res = this.field.getNearestEnemy(this);
        if (!res) return;
        let { dist, target } = res;
        if (dist <= this.range) return this.attack(target);
        else return this.move(this.field.getNextMove(this, target));
    }

    attack(target) {
        if (this.delay > 0) {
            this.delay -= this.speed;
            return;
        }
        if (this.ad - target.armor > 0) target.hp -= this.ad - target.armor;
        if (target.hp <= 0) {
            target.die = true;
            this.field.board[target.y][target.x] = null;
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

        // client에 이동 메시지 보내기

        let y = nextMove[0],
            x = nextMove[1],
            beforeX = this.x,
            beforeY = this.y;
        this.field.board[this.y][this.x] = null;
        this.field.board[y][x] = this;
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

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

module.exports = Unit;
