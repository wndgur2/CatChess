import Game from "./Game.js";

export default class Socket {
    static socket = null;
    static id = localStorage.getItem("id");

    static init() {
        this.socket = new WebSocket("ws://localhost:3000");

        this.socket.onopen = function (event) {
            console.log("웹 소켓 연결 성공");
            if (!this.id) Socket.sendMsg("getNewId", null);
            else Socket.sendMsg("getGameData", null);
        };

        this.socket.onmessage = function (event) {
            const msg = JSON.parse(event.data);
            console.log(msg);
            const { type, data } = msg;
            switch (type) {
                case "yourIdIs":
                    this.id = data;
                    localStorage.setItem("id", data);
                    break;
                case "newPlayer":
                    let cur = document.getElementById("currentPlayers");
                    cur.innerHTML = data + "명";
                    break;
                case "gameMatched":
                    Game.init();
                    break;
                case "gameData":
                    // Game.setGame(data);
                    break;
                case "arrangeState":
                    Game.arrange(data);
                    break;
                case "battleState":
                    Game.battle(data);
                    break;
                case "creep":
                    Game.creep(data);
                    break;
                case "reloadedCats":
                    Game.reloadedCats(data);
                    break;
                case "dropItem":
                    break;
                case "battle_move":
                    break;
                case "battle_attack":
                    break;
                case "battle_dead":
                    break;
                case "resBuyCat":
                    break;
                case "resPutCat":
                    break;
                case "resSellCat":
                    break;
                case "resReload":
                    break;
                case "resBuyExp":
                    break;
                case "resGiveItem":
                    break;
                default:
                    break;
            }
        };

        this.socket.onclose = function (event) {
            console.log("웹 소켓 연결 해제");
        };
        this.socket.onerror = function (event) {
            console.error(event);
        };
    }

    static sendMsg(type, data) {
        this.socket.send(
            JSON.stringify({
                from: this.id,
                type: type,
                data: data,
            })
        );
    }
}
