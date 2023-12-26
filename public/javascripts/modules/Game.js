import Player from "./Player.js";
import Socket from "./Socket.js";
import { GAME_STATES } from "./constants.js";

export default class Game {
    static init(players) {
        document.getElementById("home").style.display = "none";
        document.getElementById("waiting").style.display = "none";
        document.getElementById("game").style.display = "flex";
        Game.players = players.map((id) => new Player(id));
        Game.displayPlayersInfo();
    }

    static displayPlayersInfo() {
        let playersEl = document.createElement("div");
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
            playersEl.appendChild(playerDiv);
        });
        let rightWrapper = document.getElementById("rightWrapper");
        rightWrapper.innerHTML = "";
        rightWrapper.appendChild(playersEl);
    }

    static displayCatInfo(cat) {
        let catInfo = document.createElement("div");
        catInfo.id = "catInfo";
        catInfo.innerHTML = cat.info();
        document.getElementById("rightWrapper").appendChild(catInfo);
    }

    static set _state(newState) {
        this.state = newState;

        switch (newState) {
            case GAME_STATES.ARRANGE: {
                document.getElementById("game").style.backgroundColor = "#333";
                let cells = document.getElementsByClassName("cell");
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].id.split("-")[0] === "ally") {
                        cells[i].draggable = true;
                    }
                }
                // display player's board
                let player = Player.player;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 5; j++) {
                        let cell = document.getElementById(`ally-${i}-${j}`);
                        if (player.board[i][j] === null) {
                            cell.draggable = false;
                            cell.innerHTML = "";
                        } else {
                            cell.draggable = true;
                            cell.innerHTML = player.board[i][j].display();
                        }
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
            case GAME_STATES.READY: {
                document.getElementById("game").style.backgroundColor =
                    "#334233";
                let cells = document.getElementsByClassName("cell");
                for (let i = 0; i < cells.length; i++) {
                    if (cells[i].id.split("-")[0] === "ally") {
                        cells[i].draggable = false;
                    }
                }

                break;
            }
            case GAME_STATES.BATTLE: {
                document.getElementById("game").style.backgroundColor =
                    "#423333";
                break;
            }
            case GAME_STATES.FINISH: {
                document.getElementById("game").style.backgroundColor = "#666";
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
