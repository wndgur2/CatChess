import Item from "./Item.js";
import Painter from "./Painter.js";
import Player from "./Player.js";
import Synergy from "./Synergy.js";
import { COST_COLORS } from "./constants/CONSTS.js";
import { HEALTHBAR_WIDTH } from "./constants/THREE_CONSTS.js";
import { getBoardCoords } from "./untils.js";

export default class Unit {
    constructor(data) {
        this.id = data.id;
        this.tier = data.tier;
        this.name = data.name;
        this.skill = data.skill;
        this.synergies = data.synergies;
        this.desc = data.desc;
        this.ad = data.ad;
        this.speed = data.speed;
        this.range = data.range;
        this.maxHp = data.maxHp;
        this.hp = data.hp;
        this.maxMp = data.maxMp;
        this.mp = data.mp;
        this.armor = data.armor;
        this.originalCost = data.originalCost;
        this.cost = data.cost;
        this.owner = data.owner;
        this.items = data.items.map((item) => (item ? new Item(item) : null));

        this.x = data.x;
        this.y = data.y;

        Painter.createUnitMesh(this);
        this.inBattle = false;
        this.focused = false;

        this.imageEl = document.createElement("img");
        this.imageEl.src = `/images/units/${this.id}.jpg`;
        this.imageEl.id = "unitImg";

        this.color = COST_COLORS[this.originalCost];

        this.skillImageEl = document.createElement("img");
        this.skillImageEl.id = "unitSkill";
        this.skillImageEl.src = `/images/skills/${this.skill}.jpg`;
    }

    die() {
        Painter.scene.remove(this.mesh);
    }

    showInfo() {
        this.focused = true;
        document.getElementById("unitImgWrapper").innerHTML = "";
        document.getElementById("unitImgWrapper").appendChild(this.imageEl);

        document.getElementById("unitName").innerHTML =
            "★".repeat(this.tier) + this.name;
        document.getElementById("unitName").style.color = this.color;

        let unitSynergiesEl = document.getElementById("unitSynergies");
        unitSynergiesEl.innerHTML = "";
        this.synergies.forEach((synergy) => {
            const s = Synergy.getSynergy(synergy);
            unitSynergiesEl.appendChild(s.display());
        });
        document.getElementById("cost").innerHTML = this.cost;
        document.getElementById("hp").innerHTML = this.hp;
        document.getElementById("maxHp").innerHTML = this.maxHp;
        document.getElementById("mp").innerHTML = this.mp;
        document.getElementById("maxMp").innerHTML = this.maxMp;
        document.getElementById("ad").innerHTML = this.ad;
        document.getElementById("armor").innerHTML = this.armor;
        document.getElementById("range").innerHTML = this.range;
        document.getElementById("speed").innerHTML = this.speed;

        let unitSkillWrapperEl = document.getElementById("unitSkillWrapper");
        unitSkillWrapperEl.innerHTML = "";
        unitSkillWrapperEl.appendChild(this.skillImageEl);

        let itemEls = document.getElementsByClassName("item");
        for (let i = 0; i < itemEls.length; i++) {
            itemEls[i].innerHTML = "";
            if (!this.items[i]) return;
            itemEls[i].appendChild(this.items[i].imageEl);
        }
    }

    set _hp(newHp) {
        this.hp = newHp < 0 ? 0 : newHp;
        if (this.focused) document.getElementById("hp").innerHTML = this.hp;

        const healthBarMesh = this.mesh.getObjectByName("healthBar");
        healthBarMesh.scale.x = this.hp / this.maxHp;
        healthBarMesh.position.x =
            ((1 - this.hp / this.maxHp) * HEALTHBAR_WIDTH) / 2;

        const damagedHealthMesh = this.mesh.getObjectByName("damagedHealth");

        function animateHealthDamage() {
            if (damagedHealthMesh.scale.x > healthBarMesh.scale.x) {
                damagedHealthMesh.scale.x -= 0.01;
                damagedHealthMesh.position.x =
                    ((1 - damagedHealthMesh.scale.x) * HEALTHBAR_WIDTH) / 2;
                requestAnimationFrame(animateHealthDamage);
            } else {
                damagedHealthMesh.scale.x = healthBarMesh.scale.x;
                damagedHealthMesh.position.x =
                    ((1 - damagedHealthMesh.scale.x) * HEALTHBAR_WIDTH) / 2;
            }
        }
        animateHealthDamage();
    }

    set _mp(newMp) {
        this.mp = newMp;
        if (this.focused) document.getElementById("mp").innerHTML = this.mp;
    }

    set _damage(newDamage) {
        this.damage = newDamage;
        Player.player.setDamage(this, newDamage);
    }

    move(beforeX, beforeY, nextX, nextY) {
        const beforeCoords = getBoardCoords(beforeX, beforeY);
        const nextCoords = getBoardCoords(nextX, nextY);

        const toMoveCoords = {
            x: nextCoords[0] - beforeCoords[0],
            z: nextCoords[2] - beforeCoords[2],
        };
        const duration = 240 / this.speed;

        let i = duration;
        const animateMove = () => {
            if (i-- <= 0) return;
            this.mesh.position.x += toMoveCoords.x / duration;
            this.mesh.position.z += toMoveCoords.z / duration;
            requestAnimationFrame(animateMove);
        };

        animateMove();
    }
}
