import Item from "./Item.js";
import Painter from "./Painter.js";
import Player from "./Player.js";
import { HEALTHBAR_WIDTH } from "./constants/THREE_CONSTS.js";
import { getBoardCoords } from "./untils.js";

export default class Unit {
    constructor(data) {
        this.tier = data.tier;
        this.name = data.name;
        this.ad = data.ad;
        this.speed = data.speed;
        this.range = data.range;
        this.maxHp = data.maxHp;
        this.hp = data.hp;
        this.armor = data.armor;
        this.cost = data.cost;
        this.owner = data.owner;
        this.items = data.items.map((item) => (item ? new Item(item) : null));

        this.x = data.x;
        this.y = data.y;

        Painter.createUnitMesh(this);
        this.draggable = true;
    }

    display() {
        return `<div class="cat ${
            this.owner === Player.player.id ? "ally" : "enemy"
        }">
            <div class="catTier">🌟${this.tier}</div>
            ${
                this.items
                    ? `<div class="items">${this.items.map(
                          (item) => item.img
                      )}</div>`
                    : `<div />`
            }
            <div class="catHp">♥️${this.hp}</div>
            <div class="catName">${this.name}</div>
        </div>`;
    }

    die() {
        this.mesh.visible = false;
    }

    info() {
        return `<div class="cat">
        <div class="catTier">🌟${this.tier}</div>
        <div class="catHp">♥️${this.hp}/${this.maxHp}</div>
        
        ${
            this.items
                ? `<div class="items">${this.items.map(
                      (item) => item.img + item.name
                  )}</div>`
                : `<div />`
        }
        <div class="catName">${this.name}</div>
        <div class="catCost">💰${this.cost}</div>
        <div class="catAd">⚔️${this.ad}</div>
        <div class="catArmor">🛡${this.armor}</div>
        <div class="catSpeed">🏃${this.speed}</div>
        <div class="catRange">🎯${this.range}</div>
        </div>`;
    }

    set _hp(newHp) {
        this.hp = newHp < 0 ? 0 : newHp;

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
