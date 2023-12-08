import Socket from "./Socket.js";

export default class Player {
    static players = [];
    constructor() {
        Player.players.push(this);
    }
}
