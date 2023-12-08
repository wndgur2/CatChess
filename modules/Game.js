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

    start() {
        console.log("game start");
        this.players.forEach((player) => {
            player.game = this;
        });
        this.arrange();
    }

    arrange() {
        this.state = GAME_STATE.ARRANGE;
    }

    getGameData() {
        return {
            type: "gameData",
            data: {
                state: this.state,
                players: this.players,
            },
        };
    }
}
module.exports = Game;
