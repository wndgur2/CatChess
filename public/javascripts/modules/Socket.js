import Battle from "./Battle.js";
import Game from "./Game.js";
import Item from "./Item.js";
import Player from "./Player.js";
import Unit from "./Unit.js";
import { CATCHESS_ID } from "./constants.js";

export default class Socket {
    static socket = null;
    static id = localStorage.getItem(CATCHESS_ID);

    static init() {
        Socket.socket = new WebSocket("ws://localhost:3000");

        Socket.socket.onopen = function (event) {
            console.log("웹 소켓 연결 성공");

            if (!Socket.id) Socket.sendMsg("reqNewId", null);
            else document.getElementById(CATCHESS_ID).innerHTML = Socket.id;
        };

        Socket.socket.onmessage = function (event) {
            const { type, data } = JSON.parse(event.data);

            if (type !== "timeUpdate")
                console.log(type, JSON.parse(JSON.stringify(data)));

            switch (type) {
                case "resNewId": {
                    Socket.id = data;
                    document.getElementById(CATCHESS_ID).innerHTML = data;
                    localStorage.setItem(CATCHESS_ID, data);
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
                    Player.player._maxExp = data.maxExp;
                    break;
                }
                case "levelUpdate": {
                    Player.getPlayerById(data.player)._level = data.level;
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
                    let { attacker, target, damage, reversed } = data;
                    Battle.attack(attacker, target, damage, reversed);
                    break;
                }
                case "battle_move": {
                    let { beforeX, beforeY, nextX, nextY, reversed } = data;
                    Battle.move(beforeX, beforeY, nextX, nextY, reversed);
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
                    Player.getPlayerById(data.player)._board = data.board;
                    Player.getPlayerById(data.player)._queue = data.queue;
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
                            if (!cat) return null;
                            return new Unit(cat);
                        })
                    );
                    Battle.initBattle(data.reversed);
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
                case "gameEnd": {
                    if (data.winner === Socket.id) alert("승리!");
                    else alert("패배!");
                    window.location.reload();
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
