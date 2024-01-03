import Socket from "./Socket.js";

export default class Item {
    constructor(data) {
        this.name = data.name;
        this.desc = data.desc;
    }

    info() {
        return `<div class="itemInfo">
        <div class="itemInfoTitle">${this.name}</div>
        <div class="itemInfoDesc">${this.desc}</div>
        </div>`;
    }

    display() {
        return `<div class="item">
        <div class="itemName">${this.name}</div>
        </div>`;
    }
}
