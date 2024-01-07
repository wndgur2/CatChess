const Board = require("./Board");
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
        /**
         * @type {Board}
         */
        this.board = null;

        this.delay = 0;
    }

    action() {
        if (this.die) return;
        let res = this.board.getNearestEnemy(this);
        if (!res) return;
        let { dist, target } = res;
        if (dist <= this.range) this.attack(target);
        else this.move(this.board.getNextMove(this, target));
    }

    attack(target) {
        if (this.delay > 0) {
            this.delay -= this.speed;
            return;
        }
        // client에 공격 메시지 보내기
        if (this.ad - target.armor > 0) target.hp -= this.ad - target.armor;
        if (target.hp <= 0) {
            target.die = true;
            this.board.board[target.y][target.x] = null;
            if (target.owner == "creep")
                getPlayer(this.owner).pushItem(Item.getRandomItem());
        }
        this.delay += 100;
    }

    move(nextMove) {
        if (this.delay > 0) {
            this.delay -= this.speed / 2;
            return;
        }
        if (!nextMove) return;

        // client에 이동 메시지 보내기
        let y = nextMove[0],
            x = nextMove[1];
        this.board.board[this.y][this.x] = null;
        this.board.board[y][x] = this;
        this.y = y;
        this.x = x;
        this.delay += 100;
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

module.exports = Unit;
