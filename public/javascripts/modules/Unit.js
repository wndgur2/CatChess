import Painter from "./Painter.js";
import Player from "./Player.js";

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
        this.items = data.items;

        this.x = data.x;
        this.y = data.y;

        Painter.createUnitMesh(this);
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

    die() {}

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

    updateMesh() {
        Painter.updateUnitMesh(this);
    }
}
