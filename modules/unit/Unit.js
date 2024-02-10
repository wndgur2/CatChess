const Item = require("../Item");
const SKILLS = require("../constants/SKILLS");
const { getPlayer } = require("../utils");

class Unit {
    static number = 0;
    constructor(proto, playerId, x, y, tier) {
        this.uid = Unit.number++;
        this.tier = tier;
        this.id = proto.id;
        this.name = proto.name;
        this.synergies = proto.synergies;
        this.desc = proto.desc;
        this.originalCost = proto.cost;
        this.cost = proto.cost * Math.pow(3, tier - 1);
        if (tier > 1) this.cost -= 1;

        const MAGNITUDE = Math.sqrt(this.tier).toPrecision(2);

        this.ad = parseInt(proto.ad * MAGNITUDE);
        this.speed = parseInt(proto.speed * MAGNITUDE);
        this.range = proto.range;
        this.maxHp = parseInt(proto.hp * MAGNITUDE);
        this.hp = this.maxHp;
        this.armor = parseInt(proto.armor * MAGNITUDE);

        this.skill = SKILLS[proto.skill];
        this.maxMp = parseInt(this.skill.mp);
        this.mp = 0;

        this.x = x;
        this.y = y;
        this.owner = playerId;
        this.die = false;
        this.delay = 0;

        this.items = [];
        this.modifiers = [];
    }

    update() {
        if (this.die) return;

        this.mp += 1;
        this.updateModifiers();

        if (this.mp >= this.maxMp) {
            this.delay = this.speed;
            return this.useSkill();
        }

        if (this.delay > 0) {
            this.delay -= this.getStat("speed");
            return;
        }

        let res = this.battleField.getNearestUnits(this, 30, 1, false);
        if (res.length < 1) return;

        this.delay += 100;

        let { distance, target } = res[0];
        if (distance <= this.getStat("range"))
            return this.ordinaryAttack(target);
        else return this.move(this.battleField.getNextMove(this, target));
    }

    updateModifiers() {
        this.modifiers.forEach((modifier) => {
            modifier.leftTime -= 1;
            if (modifier.leftTime <= 0)
                this.modifiers.splice(this.modifiers.indexOf(modifier), 1);
        });
    }

    getStat(key) {
        let stat = this[key];
        this.modifiers.forEach((modifier) => {
            stat += modifier[key];
        });
        let ratio = 1;
        this.modifiers.forEach((modifier) => {
            ratio *= modifier[key + "Ratio"];
        });
        return stat * ratio;
    }

    useSkill() {
        this.skill.execute(this);
        this.mp -= this.maxMp;
        this.sendMsgToGame("unitUseSkill", {
            uid: this.uid,
        });
    }

    ordinaryAttack(target) {
        this.attack(target, this.getStat("ad") - target.getStat("armor"));
    }

    attack(target, damage) {
        if (damage <= 0) damage = 1;
        target.hp -= damage;

        this.sendMsgToGame("unitAttack", {
            attacker: { uid: this.uid },
            target: {
                uid: target.uid,
                hp: target.hp,
            },
            damage,
        });

        if (target.hp <= 0) {
            target.die = true;
            this.battleField.field[target.y][target.x] = null;

            this.sendMsgToGame("unitDie", {
                uid: target.uid,
            });

            // item drop
            if (target.owner.split("-")[0] == "creep") {
                getPlayer(this.owner).pushItem(Item.getRandomItem());
                // getPlayer(this.owner).pushItem(Item.getRandomItem());
            }
        }
    }

    move(nextMove) {
        if (!nextMove) return;

        let y = nextMove[0],
            x = nextMove[1];

        this.battleField.field[this.y][this.x] = null;
        this.battleField.field[y][x] = this;
        this.y = y;
        this.x = x;

        this.sendMsgToGame("unitMove", {
            uid: this.uid,
            nextX: x,
            nextY: y,
        });
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

    pushModifier(modifier) {
        this.modifiers.push(modifier);
        modifier.unit = this;
    }

    sendMsgToGame(type, data) {
        const p = getPlayer(this.owner);
        p.game.sendMsgToAll(type, { ...data, battleId: p.battle.id });
    }

    clone() {
        // *옵젝 속의 옵젝은 얕은 복사
        let clone = Object.assign(
            Object.create(Object.getPrototypeOf(this)),
            this
        );
        clone.modifiers = [];
        return clone;
    }
}

module.exports = Unit;
