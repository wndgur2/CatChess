export default class SimpleCat {
    constructor(data) {
        console.log(data);
        this.tier = data.tier;
        this.name = data.name;
        this.ad = data.ad;
        this.speed = data.speed;
        this.range = data.range;
        this.maxHp = data.maxHp;
        this.hp = data.hp;
        this.armor = data.armor;
        this.cost = data.cost;

        this.x = data.x;
        this.y = data.y;
    }

    display() {
        return `<div class="cat">
        <div class="catHp">♥️${this.hp}</div>
        <div class="catName">${this.name}</div>
        </div>`;
    }

    die() {
        return `<div class="cat">
        <div class="catHp">💀</div>
        <div class="catName">${this.name}</div>
        </div>`;
    }

    info() {
        return `<div class="cat">
        <div class="catTier">🌟${this.tier}</div>
        <div class="catHp">♥️${this.hp}/${this.maxHp}</div>
        <div class="catName">${this.name}</div>
        <div class="catHp">💰${this.cost}</div>
        <div class="catHp">⚔️${this.ad}</div>
        <div class="catHp">🛡${this.armor}</div>
        <div class="catHp">🏃${this.speed}</div>
        <div class="catHp">🎯${this.range}</div>
        </div>`;
    }
}
