import Player from "./Player.js";
import Socket from "./Socket.js";
import { GAME_STATE } from "./constants.js";

export default class Game {
    static isStarted = false;
    static players = [];
    static getPlayerById(id) {
        return Game.players.find((player) => player.id === id);
    }

    static init(players, existingPlayers) {
        document.getElementById("home").style.display = "none";
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";
        Game.players = [];
        Game.players = players.map((id) => new Player(id));

        this.players.forEach((player) => {
            let playerDiv = document.createElement("div");
            playerDiv.id = `player-${player.id}`;
            playerDiv.className = "player";
            playerDiv.innerHTML = `id: ${player.id}`;
            let playerHp = document.createElement("div");
            playerHp.id = `${player.id}-hp`;
            playerHp.className = "hp";
            playerHp.innerHTML = `hp: ${player.hp}`;
            playerDiv.appendChild(playerHp);
            document.getElementById("players").appendChild(playerDiv);
        });

        Game.players.forEach((player) => {
            if (existingPlayers) {
                Object.keys(existingPlayers).forEach((id) => {
                    Game.getPlayerById(id).load(existingPlayers[id]);
                });
            } else {
                player.init();
                Socket.sendMsg("reqReload", "");
            }
        });

        Game.isStarted = true;
        Game.timer = 0;
        setInterval(() => {
            if (Game.timer <= 0) return;
            Game.timer = Game.timer - 1;
            document.getElementById("timer").innerHTML = Game.timer;
        }, 1000);
    }

    constructor() {}

    static set _state(newState) {
        this.state = newState;

        switch (newState) {
            case GAME_STATE.ARRANGE: {
                document.getElementById("game").style.backgroundColor = "#333";
                Game._timer = 20;
                let cells = document.getElementsByClassName("cell");
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].id.split("-")[0] === "board") {
                        cells[i].draggable = true;
                    }
                }
                break;
            }
            case GAME_STATE.WAIT: {
                document.getElementById("game").style.backgroundColor =
                    "#334233";
                Game._timer = 3;
                let cells = document.getElementsByClassName("cell");
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].id.split("-")[0] === "board") {
                        cells[i].draggable = false;
                    }
                }
                break;
            }
            case GAME_STATE.BATTLE: {
                document.getElementById("game").style.backgroundColor =
                    "#423333";
                Game._timer = 30;
                break;
            }
        }

        document.getElementById("state").innerHTML = newState;
    }

    static set _timer(newTimer) {
        Game.timer = newTimer;
        document.getElementById("timer").innerHTML = newTimer;
    }

    static set _round(newRound) {
        Game.round = newRound;
        document.getElementById("round").innerHTML = newRound;
    }

    static set _stage(newStage) {
        Game.stage = newStage;
        document.getElementById("stage").innerHTML = newStage;
    }
}
