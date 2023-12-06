const GAME_STATE = {
    WAIT: "wait",
    ARRANGE: "arrange",
    BATTLE: "battle",
    FINISH: "finish",
};

Object.freeze(GAME_STATE);

class Game {
    constructor(players) {
        this.state = GAME_STATE.WAIT;
        this.players = players;
        this.winner = null;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    start() {}
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = Game;
}

// ES6 Modules (browser)
if (typeof window !== "undefined") {
    window.Game = Game;
}
