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
        this.synergies = data.synergies;
        this.desc = data.desc;
        this.ad = data.ad;
        this.speed = data.speed;
        this.range = data.range;
        this.maxHp = data.maxHp;
        this.hp = data.hp;
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

        // load image from images/units/this.id.jpg
        this.image = `<img id="unitImg" src="/images/units/${this.id}.jpg" />`;
        this.color = COST_COLORS[this.originalCost];
    }

    die() {
        Painter.scene.remove(this.mesh);
    }

    showInfo() {
        this.focused = true;
        document.getElementById("unitImgWrapper").innerHTML = this.image;
        document.getElementById("unitName").innerHTML =
            "★".repeat(this.tier) + this.name;
        document.getElementById("unitName").style.color = this.color;
        let unitSynergiesEl = document.getElementById("unitSynergies");
        unitSynergiesEl.innerHTML = "";
        this.synergies.forEach((synergy) => {
            console.log(synergy);
            const s = Synergy.getSynergy(synergy);
            unitSynergiesEl.appendChild(s.display());
        });
        document.getElementById("cost").innerHTML = this.cost;
        document.getElementById("hp").innerHTML = this.hp;
        document.getElementById("maxHp").innerHTML = this.maxHp;
        document.getElementById("ad").innerHTML = this.ad;
        document.getElementById("armor").innerHTML = this.armor;
        document.getElementById("range").innerHTML = this.range;
        document.getElementById("speed").innerHTML = this.speed;
        let itemEls = document.getElementsByClassName("item");
        for (let i = 0; i < itemEls.length; i++) {
            itemEls[i].innerHTML = this.items[i] ? this.items[i].image : "";
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
