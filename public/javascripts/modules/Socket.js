import Game from "./Game.js";
import Player from "./Player.js";

export default class Socket {
    static socket = null;
    static id = localStorage.getItem("id");

    static init() {
        Socket.socket = new WebSocket("ws://localhost:3000");

        Socket.socket.onopen = function (event) {
            console.log("웹 소켓 연결 성공");
            if (!Socket.id) Socket.sendMsg("reqNewId", null);
            else {
                Socket.sendMsg("reqGameData", null);
                document.getElementById("id").innerHTML = Socket.id;
            }
        };

        Socket.socket.onmessage = function (event) {
            const msg = JSON.parse(event.data);
            console.log(msg);
            const { type, data } = msg;
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
                case "resGameData":
                    Game.init(data.game.players, data.players);
                    break;
                case "resBuyCat":
                    break;
                case "resPutCat":
                    break;
                case "resSellCat":
                    break;
                case "resReload":
                    Game.getPlayerById(data.player).shoplist = data.shoplist;
                    break;
                case "expUpdate":
                    Player.player.exp = data.exp;
                    break;
                case "levelUpdate":
                    if (data.player === Socket.id) {
                        Player.player.level = data.level;
                        Player.player.maxExp = data.level * 3;
                    } else {
                        Game.getPlayerById(data.player).level = data.level;
                    }
                case "resGiveItem":
                    break;
                case "arrangeState":
                    Game.arrange(data);
                    break;
                case "battleState":
                    Game.battle(data);
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
                    Game.getPlayerById(data.player).money = data.money;
                    if (data.player === Socket.id) {
                        let money = document.getElementById("money");
                        money.innerHTML = data.money;
                    }
                    break;
                case "boardUpdate":
                    Game.getPlayerById(data.player).queue = data.queue.map(
                        (cat) => JSON.parse(cat)
                    );
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
