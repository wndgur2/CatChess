import Battle from "./Battle.js";
import Game from "./Game.js";
import Item from "./Item.js";
import Painter from "./Painter.js";
import Player from "./Player.js";
import UI from "./UI.js";
import Unit from "./Unit.js";
import { CATCHESS_ID } from "./constants/CONSTS.js";

export default class Socket {
    static socket = null;
    static id = localStorage.getItem(CATCHESS_ID);

    static init() {
        Socket.socket = new WebSocket("ws://localhost:3000");

        Socket.socket.onopen = function (event) {
            console.log("web socket connected.");
            if (!Socket.id) Socket.sendMsg("reqNewId", null);
            else document.getElementById("id").innerHTML = Socket.id;
        };

        Socket.socket.onmessage = function (event) {
            const { type, data } = JSON.parse(event.data);

            if (type !== "timeUpdate")
                console.log(type, JSON.parse(JSON.stringify(data)));

            switch (type) {
                case "resNewId": {
                    Socket.id = data;
                    document.getElementById("id").innerHTML = data;
                    localStorage.setItem(CATCHESS_ID, data);
                    break;
                }
                case "gameMatched": {
                    // three
                    UI.gameStart();
                    Game.init(data.players);
                    break;
                }
                case "timeUpdate": {
                    Game._time = data.time;
                    break;
                }
                case "stageUpdate": {
                    Game._round = data.round;
                    Game._stage = data.stage;
                    Painter.resetMeshes();
                    UI.hideUnitInfo();
                    break;
                }
                case "stateUpdate": {
                    Game._state = data.state;
                    Game._time = data.time;
                    break;
                }
                case "boardUpdate": {
                    Player.getPlayerById(data.player)._board = data.board.map(
                        (row) => row.map((cat) => (cat ? new Unit(cat) : null))
                    );
                    break;
                }
                case "queueUpdate": {
                    Player.getPlayerById(data.player)._queue = data.queue;
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
                case "moneyUpdate": {
                    Player.getPlayerById(data.player)._money = data.money;
                    break;
                }
                case "shopUpdate": {
                    Player.getPlayerById(data.player)._shop = data.shop;
                    break;
                }
                case "itemUpdate": {
                    Player.getPlayerById(data.player)._items = data.items.map(
                        (item) => (item ? new Item(item) : null)
                    );
                    break;
                }
                case "hpUpdate": {
                    let p = Player.getPlayerById(data.player);
                    if (p) p._hp = data.hp;
                    break;
                }
                case "battleReady": {
                    Battle.board = data.board.map((row) =>
                        row.map((cat) => (cat ? new Unit(cat) : null))
                    );
                    Battle.ready(data.reversed);
                    UI.hideUnitInfo();
                    break;
                }
                case "battleInit": {
                    Battle.init(data.timeStep);
                    break;
                }
                case "battleAttack": {
                    let { attacker, target, damage } = data;
                    Battle.attack(attacker, target, damage);
                    break;
                }
                case "battleUseSkill": {
                    let { position, skill } = data;
                    Battle.useSkill(position, skill);
                    break;
                }
                case "battleMove": {
                    let { beforeX, beforeY, nextX, nextY } = data;
                    Battle.move(beforeX, beforeY, nextX, nextY);
                    break;
                }
                case "battleItemUpdate": {
                    let { unit } = data;
                    Battle.itemUpdate(unit);
                    break;
                }
                case "battleResult": {
                    data.players.forEach(([player, hp]) => {
                        let p = Player.getPlayerById(player);
                        if (p) p._hp = hp;
                    });
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
                    break;
                }
                case "synergiesUpdate": {
                    Player.getPlayerById(data.player)._synergies =
                        data.synergies;
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
