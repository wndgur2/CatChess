export default class Item {
    constructor(data) {
        this.name = data.name;
        this.desc = data.desc;
        this.img = data.img;
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
        return `<div class="itemInfo">
        <div class="itemInfoImg">${this.img}</div>
        <div class="itemInfoName">${this.name}</div>
        <div class="itemInfoDesc">${this.getStat()}</div>
        </div>`;
    }

    display() {
        return `<div class="item">
        <div class="itemImg">${this.img}</div>
        </div>`;
    }
}
