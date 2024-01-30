const Item = require("../Item");
const SKILLS = require("../constants/SKILLS");
const { getPlayer } = require("../utils");

class Unit {
    static number = 0;
    constructor(proto, playerId, x, y, tier) {
        // 유닛 고유 id 필요
        this.uid = Unit.number++;
        this.tier = tier;
        this.proto = proto;
        this.id = proto.id;
        this.name = this.proto.name;
        this.synergies = this.proto.synergies;
        this.desc = this.proto.desc;
        this.originalCost = this.proto.cost;
        this.cost = this.proto.cost * Math.pow(3, tier - 1);
        if (tier > 1) this.cost -= 1;

        const magnifier = Math.sqrt(this.tier).toPrecision(2);
        this.ad = parseInt(this.proto.ad * magnifier);
        this.speed = parseInt(this.proto.speed * magnifier);
        this.range = this.proto.range;
        this.maxHp = parseInt(this.proto.hp * magnifier);
        this.hp = this.maxHp;
        this.armor = parseInt(this.proto.armor * magnifier);

        this.items = [];

        this.skill = SKILLS[this.proto.skill];
        this.maxMp = parseInt(this.skill.mp);
        this.mp = 0;

        this.x = x;
        this.y = y;
        this.owner = playerId;
        this.die = false;
        this.battleField = null;
        this.delay = 0;

        this.modifiers = [];
    }

    action() {
        if (this.die) return;
        this.mp += 1;
        if (this.delay > 0) {
            this.delay -= this.speed;
            return;
        }

        let res = this.battleField.getNearestUnits(this, 30, 1, false);
        if (res.length < 1) return;
        let { distance, target } = res[0];
        if (distance <= this.range) return this.attack(target);
        else return this.move(this.battleField.getNextMove(this, target));
    }

    attack(target) {
        let responses = [];

        if (this.mp >= this.maxMp) {
            this.skill.execute(this);
            this.mp -= this.maxMp;
            return [
                {
                    type: "unitUseSkill",
                    data: {
                        uid: this.uid,
                    },
                },
            ];
        }

        let damage;
        if (this.ad - target.armor > 0) damage = this.ad - target.armor;
        else damage = 1;
        target.hp -= damage;

        this.delay += 100;

        responses.push({
            type: "unitAttack",
            data: {
                attacker: { uid: this.uid },
                target: {
                    uid: target.uid,
                    hp: target.hp,
                },
                damage,
            },
        });

        if (target.hp <= 0) {
            target.die = true;
            this.battleField.board[target.y][target.x] = null;

            responses.push({
                type: "unitDie",
                data: {
                    uid: target.uid,
                },
            });

            // item drop
            if (target.owner == "creep") {
                getPlayer(this.owner).pushItem(Item.getRandomItem());
                getPlayer(this.owner).pushItem(Item.getRandomItem());
            }
        }

        return responses;
    }

    move(nextMove) {
        if (!nextMove) return;

        let y = nextMove[0],
            x = nextMove[1];

        this.battleField.board[this.y][this.x] = null;
        this.battleField.board[y][x] = this;
        this.y = y;
        this.x = x;
        this.delay += 100;

        return [
            {
                type: "unitMove",
                data: {
                    uid: this.uid,
                    nextX: x,
                    nextY: y,
                },
            },
        ];
    }

    equip(item) {
        if (this.items.length >= 3) return false;
        this.items.push(item);
        this.ad += item.ad;
        this.hp += item.hp;
        this.maxHp += item.hp;
        this.armor += item.armor;
        this.range += item.range;
        this.speed += item.speed;
        return true;
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

module.exports = Unit;
