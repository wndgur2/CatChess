export default class Item {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.desc = data.desc;
        this.img = data.img;
        this.image = `<img class="itemImg" src="/images/items/${this.id}.jpg" />`;
        this.ad = data.ad;
        this.hp = data.hp;
        this.armor = data.armor;
        this.range = data.range;
    }

    getStat() {
        let type = this.ad
            ? "공격력"
            : this.hp
            ? "체력"
            : this.armor
            ? "방어력"
            : this.range
            ? "사거리"
            : "";
        let stat = this.ad || this.hp || this.armor || this.range;
        return `${type} +${stat}`;
    }

    info() {
        return `<div style="text-align:center;">
        <div>${this.img}</div>
        <div>${this.name}</div>
        <div>${this.getStat()}</div>
        </div>`;
    }

    display() {
        return `<div>
        <div>${this.img}</div>
        </div>`;
    }
}
