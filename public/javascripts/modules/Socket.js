import Battle from "./Battle.js";
import Game from "./Game.js";
import Item from "./Item.js";
import Player from "./Player.js";
import SimpleCat from "./SimpleCat.js";

export default class Socket {
    static socket = null;
    static id = localStorage.getItem("id");

    static init() {
        Socket.socket = new WebSocket("ws://localhost:3000");

        Socket.socket.onopen = function (event) {
            console.log("웹 소켓 연결 성공");

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
                case "resNewId": {
                    Socket.id = data;
                    document.getElementById("id").innerHTML = data;
                    localStorage.setItem("id", data);
                    break;
                }
                case "gameMatched": {
                    Game.init(data.players);
                    break;
                }
                case "shopUpdate": {
                    Player.getPlayerById(data.player)._shop = data.shop;
                    break;
                }
                case "expUpdate": {
                    Player.player._exp = data.exp;
                    break;
                }
                case "levelUpdate": {
                    if (data.player === Socket.id) {
                        Player.player._level = data.level;
                        Player.player._maxExp = 2 + (data.level - 1) * 3;
                    } else {
                        Player.getPlayerById(data.player)._level = data.level;
                    }
                }
                case "resGiveItem": {
                    break;
                }
                case "stateUpdate": {
                    Game._state = data.state;
                    Game._time = data.time;
                    break;
                }
                case "stageUpdate": {
                    Game._round = data.round;
                    Game._stage = data.stage;
                    break;
                }
                case "battle_attack": {
                    // TODO
                    break;
                }
                case "battle_dead": {
                    // TODO
                    break;
                }
                case "itemUpdate": {
                    Player.getPlayerById(data.player)._items = data.items.map(
                        (item) => (item ? new Item(item) : null)
                    );
                    break;
                }
                case "moneyUpdate": {
                    Player.getPlayerById(data.player)._money = data.money;
                    break;
                }
                case "boardUpdate": {
                    Player.getPlayerById(data.player)._board = data.board.map(
                        (row) => row.map((cat) => JSON.parse(cat))
                    );
                    Player.getPlayerById(data.player)._queue = data.queue.map(
                        (cat) => JSON.parse(cat) //TODO: new Simple cat으로 바꾸기
                    );
                    break;
                }
                case "hpUpdate": {
                    let p = Player.getPlayerById(data.player);
                    if (p) p._hp = data.hp;
                    break;
                }
                case "battleUpdate": {
                    Battle.board = data.board.map((row) =>
                        row.map((cat) => {
                            if (cat) return new SimpleCat(cat);
                            else return null;
                        })
                    );
                    Battle.displayBoard(data.reversed);
                    break;
                }
                case "battleResult": {
                    data.players.forEach(([player, hp]) => {
                        let p = Player.getPlayerById(player);
                        if (p) p._hp = hp;
                    });
                    break;
                }
                case "timeUpdate": {
                    Game._time = data.time;
                    break;
                }
                case "winningUpdate": {
                    Player.getPlayerById(data.player)._winning = data.winning;
                    break;
                }
                case "losingUpdate": {
                    Player.getPlayerById(data.player)._losing = data.losing;
                    break;
                }
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
