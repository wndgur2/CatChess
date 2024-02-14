import Player from "./Player.js";

export default class Game {
    static init(players) {
        // TODO: 두판쨰 고려
        Game.players = players.map((id) => {
            const p = Player.getPlayerById(id);
            if (p) return p;
            else return new Player(id);
        });
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
