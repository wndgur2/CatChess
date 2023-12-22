import Game from "./Game.js";
import Player from "./Player.js";

export default class Socket {
    static socket = null;
    static id = localStorage.getItem("id");

    static init() {
        Socket.socket = new WebSocket("ws://localhost:3000");

        Socket.socket.onopen = function (event) {
            console.log("웹 소켓 연결 성공");
            // Socket.sendMsg("reqNewId", null);
            if (!Socket.id) Socket.sendMsg("reqNewId", null);
            else {
                document.getElementById("id").innerHTML = Socket.id;
            }
        };

        Socket.socket.onmessage = function (event) {
            const msg = JSON.parse(event.data);
            const { type, data } = msg;
            if (type !== "timeUpdate") console.log(msg);
            switch (type) {
                case "resNewId":
                    Socket.id = data;
                    document.getElementById("id").innerHTML = data;
                    localStorage.setItem("id", data);
                    break;
                case "newPlayer":
                    let cur = document.getElementById("currentPlayers");
                    cur.innerHTML = data + "명";
                    break;
                case "gameMatched":
                    Game.init(data.players);
                    break;
                case "shoplistUpdate":
                    Player.getPlayerById(data.player)._shoplist = data.shoplist;
                    break;
                case "expUpdate":
                    Player.player._exp = data.exp;
                    break;
                case "levelUpdate":
                    if (data.player === Socket.id) {
                        Player.player._level = data.level;
                        Player.player._maxExp = 2 + (data.level - 1) * 3;
                    } else {
                        Player.getPlayerById(data.player)._level = data.level;
                    }
                case "resGiveItem":
                    break;
                case "stateUpdate":
                    Game._state = data.state;
                    Game._time = data.time;
                    break;
                case "stageUpdate":
                    Game._round = data.round;
                    Game._stage = data.stage;
                    break;
                case "battle_move":
                    break;
                case "battle_attack":
                    break;
                case "battle_dead":
                    break;
                case "creep":
                    Game.creep(data);
                    break;
                case "dropItem":
                    break;
                case "moneyUpdate":
                    if (data.player === Socket.id) {
                        Player.getPlayerById(data.player)._money = data.money;
                    } else {
                        Player.getPlayerById(data.player).money = data.money;
                    }
                    break;
                case "boardUpdate":
                    if (data.player === Socket.id) {
                        Player.getPlayerById(data.player)._board =
                            data.board.map((row) =>
                                row.map((cat) => JSON.parse(cat))
                            );
                        Player.getPlayerById(data.player)._queue =
                            data.queue.map((cat) => JSON.parse(cat));
                    } else {
                        Player.getPlayerById(data.player).board =
                            data.board.map((row) =>
                                row.map((cat) => JSON.parse(cat))
                            );
                        Player.getPlayerById(data.player).queue =
                            data.queue.map((cat) => JSON.parse(cat));
                    }
                    break;
                case "playerHpUpdate":
                    data.players.forEach((player) => {
                        Player.getPlayerById(player.id)._hp = player.hp;
                    });
                    break;
                case "battleStart":
                    Player.player._enemyBoard = data.board.map((row) =>
                        row.map((cat) => JSON.parse(cat))
                    );
                    break;
                case "timeUpdate":
                    Game._time = data.time;
                    break;
                default:
                    break;
            }
        };

        Socket.socket.onclose = function (event) {
            console.log("웹 소켓 연결 해제");
        };
        Socket.socket.onerror = function (event) {
            console.error(event);
        };
    }

    static sendMsg(type, data) {
        Socket.socket.send(
            JSON.stringify({
                from: Socket.id,
                type: type,
                data: data,
            })
        );
    }
}
