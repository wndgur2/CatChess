import Socket from "./Socket.js";

export default class Item {
    constructor(data) {
        this.name = data.name;
        this.desc = data.desc;
        this.img = data.img;
    }

    info() {
        return `<div class="itemInfo">
        <div class="itemInfoImg">${this.img}</div>
        <div class="itemInfoName">${this.name}</div>
        <div class="itemInfoDesc">${this.desc}</div>
        </div>`;
    }

    display() {
        return `<div class="item">
        <div class="itemImg">${this.img}</div>
        </div>`;
    }
}
