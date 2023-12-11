import Game from "./Game.js";

export default class Socket {
    static socket = null;
    static id = localStorage.getItem("id");

    static init() {
        this.socket = new WebSocket("ws://localhost:3000");

        this.socket.onopen = function (event) {
            console.log("웹 소켓 연결 성공");
            Socket.sendMsg("init", null);
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
                case "playerData":
                    Game.setSinglePlayer(data);
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
