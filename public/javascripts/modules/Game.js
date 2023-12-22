import Player from "./Player.js";
import Socket from "./Socket.js";
import { GAME_STATE } from "./constants.js";

export default class Game {
    static init(players) {
        document.getElementById("home").style.display = "none";
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";
        Game.players = players.map((id) => new Player(id));
        Game.displayPlayersInfo();
    }

    static displayPlayersInfo() {
        Game.players.forEach((player) => {
            let playerDiv = document.createElement("div");
            playerDiv.id = `player-${player.id}`;
            playerDiv.className = "player";
            playerDiv.innerHTML = player.id;
            let playerHp = document.createElement("div");
            playerHp.id = `${player.id}-hp`;
            playerHp.className = "hp";
            playerHp.innerHTML = player.hp;
            playerDiv.appendChild(playerHp);
            document.getElementById("players").appendChild(playerDiv);
        });
    }

    constructor() {}

    static set _state(newState) {
        this.state = newState;

        switch (newState) {
            case GAME_STATE.ARRANGE: {
                document.getElementById("game").style.backgroundColor = "#333";
                let cells = document.getElementsByClassName("cell");
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].id.split("-")[0] === "board") {
                        cells[i].draggable = true;
                    }
                }

                // empty enemy boards
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 5; j++) {
                        let cell = document.getElementById(`enemy-${i}-${j}`);
                        cell.innerHTML = "";
                    }
                }

                break;
            }
            case GAME_STATE.WAIT: {
                document.getElementById("game").style.backgroundColor =
                    "#334233";
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
                break;
            }
        }

        document.getElementById("state").innerHTML = newState;
    }

    static set _time(newTime) {
        Game.time = newTime;
        document.getElementById("timer").innerHTML = newTime;
    }

    static set _round(newRound) {
        Game.round = newRound;
        document.getElementById("round").innerHTML = newRound;
    }

    static set _stage(newStage) {
        Game.stage = newStage;
        document.getElementById("stage").innerHTML =
            newStage === 1 ? `${newStage}(creep)` : newStage;
    }
}
