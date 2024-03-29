import * as THREE from "three";
import Item from "./Item.js";
import Painter from "./Painter.js";
import Synergy from "./Synergy.js";
import { COST_COLORS } from "./constants/CONSTS.js";
import THREE_CONSTS from "./constants/THREE_CONSTS.js";
import { getBoardCoords } from "./utils.js";

export default class Unit {
    static async fetchData() {
        await fetch("/api/cats")
            .then((res) => res.json())
            .then((data) => {
                Unit.CATS = data;
                return data;
            });
        await fetch("/api/creeps")
            .then((res) => res.json())
            .then((data) => {
                Unit.CREEPS = data;
                return data;
            });
    }

    static imageEls = {};
    static skillImageEls = {};
    constructor(data) {
        this.id = data.id;
        this.uid = data.uid;
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

        this.inBattle = false;
        this.focused = false;

        if (!Unit.imageEls[this.id]) {
            this.imageEl = document.createElement("img");
            this.imageEl.src = `/images/portraits/${this.id}.jpg`;
            this.imageEl.id = "unitImg";
            Unit.imageEls[this.id] = this.imageEl;
        } else this.imageEl = Unit.imageEls[this.id];

        this.color = COST_COLORS[this.originalCost];

        if (!Unit.skillImageEls[this.skill.id]) {
            this.skillImageEl = document.createElement("img");
            this.skillImageEl.id = "unitSkill";
            this.skillImageEl.src = `/images/skills/${this.skill.id}.jpg`;
            Unit.skillImageEls[this.skill.id] = this.skillImageEl;
        } else this.skillImageEl = Unit.skillImageEls[this.skill.id];

        /**
         * @type {THREE.Mesh}
         */
        this.mesh = null;
        Painter.createUnitMesh(this);
    }

    die() {
        this._hp = 0;
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

    skillInfo() {
        return `<div><span>${this.skill.name}</span><br /><span>${this.skill.desc}</span></div>`;
    }

    set _hp(newHp) {
        this.hp = newHp < 0 ? 0 : newHp;
        if (this.focused) document.getElementById("hp").innerHTML = this.hp;

        const healthBarMesh = this.mesh.getObjectByName("healthBar");
        healthBarMesh.scale.x = this.hp / this.maxHp;
        healthBarMesh.position.x =
            ((1 - this.hp / this.maxHp) * THREE_CONSTS.HEALTHBAR_WIDTH) / 2;

        const damagedHealthMesh = this.mesh.getObjectByName("damagedHealth");

        function animateHealthDamage() {
            if (damagedHealthMesh.scale.x > healthBarMesh.scale.x) {
                damagedHealthMesh.scale.x -= 0.01;
                damagedHealthMesh.position.x =
                    ((1 - damagedHealthMesh.scale.x) *
                        THREE_CONSTS.HEALTHBAR_WIDTH) /
                    2;
                requestAnimationFrame(animateHealthDamage);
            } else {
                damagedHealthMesh.scale.x = healthBarMesh.scale.x;
                damagedHealthMesh.position.x =
                    ((1 - damagedHealthMesh.scale.x) *
                        THREE_CONSTS.HEALTHBAR_WIDTH) /
                    2;
            }
        }
        animateHealthDamage();
    }

    set _mp(newMp) {
        this.mp = newMp;
        if (this.focused) document.getElementById("mp").innerHTML = this.mp;
    }

    attack(target) {
        // rotate unit toward target
        const bodyMesh = this.mesh.getObjectByName("unit");
        bodyMesh.lookAt(target.mesh.position);

        // move unit to target
        const duration = 12;
        let i = 0;
        function animate() {
            if (i < duration / 2) bodyMesh.translateZ(0.2);
            else bodyMesh.translateZ(-0.2);
            if (++i < duration) requestAnimationFrame(animate);
        }
        animate();
    }

    move(nextX, nextY) {
        const beforeCoords = getBoardCoords(this.x, this.y);
        const nextCoords = getBoardCoords(nextX, nextY);

        this.mesh
            .getObjectByName("unit")
            .lookAt(new THREE.Vector3(...nextCoords));

        this.mesh
            .getObjectByName("unit")
            .rotation.set(0, this.mesh.getObjectByName("unit").rotation.y, 0);

        const toMoveCoords = {
            x: nextCoords[0] - beforeCoords[0],
            z: nextCoords[2] - beforeCoords[2],
        };

        const durationToMove = 240 / this.speed;
        let i = 0;
        const animateMove = () => {
            if (++i > durationToMove) return;
            this.mesh.position.x += toMoveCoords.x / durationToMove;
            this.mesh.position.z += toMoveCoords.z / durationToMove;
            requestAnimationFrame(animateMove);
        };

        animateMove();
    }
}
