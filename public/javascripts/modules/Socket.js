import Battle from "./Battle.js";
import Game from "./Game.js";
import Item from "./Item.js";
import Player from "./Player.js";
import UI from "./UI.js";
import Unit from "./Unit.js";
import { CATCHESS_ID } from "./constants/CONSTS.js";

export default class Socket {
    static socket = null;
    static id = localStorage.getItem(CATCHESS_ID);

    static init() {
        // Socket.socket = new WebSocket("ws://localhost:8080");
        Socket.socket = new WebSocket(
            "ws://catchess.ap-northeast-2.elasticbeanstalk.com:8080"
        );

        Socket.socket.onopen = function (event) {
            console.log("web socket connected.");
            if (!Socket.id) Socket.sendMsg("reqNewId", null);
            else {
                document.getElementById("id").innerHTML = Socket.id;
                const playBtn = document.getElementById("playBtn");
                playBtn.className = "btnActive";
                playBtn.innerHTML = "<span>Match</span>";
            }
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
                    UI.gameStart();
                    UI.closeModal();
                    Game.init(data.players);
                    break;
                }
                case "playerData": {
                    const p = Player.getPlayerById(data.id);
                    if (p) p._hp = data.hp;
                }
                case "timeUpdate": {
                    Game._time = data.time;
                    break;
                }
                case "stageUpdate": {
                    Game._round = data.round;
                    Game._stage = data.stage;
                    UI.hideUnitInfo();
                    break;
                }
                case "stateUpdate": {
                    Game._state = data.state;
                    Game._time = data.time;
                    break;
                }
                case "boardUpdate": {
                    Player.getPlayerById(data.player)._board = data.board;
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
                    Battle.id = data.battleId;
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
                case "unitAttack": {
                    let { battleId, attacker, target, damage } = data;
                    if (Battle.id != battleId) return;
                    Battle.attack(attacker, target, damage);
                    break;
                }
                case "unitUseSkill": {
                    let { battleId, uid } = data;
                    if (Battle.id != battleId) return;
                    Battle.useSkill(uid);
                    break;
                }
                case "unitMove": {
                    let { battleId, uid, nextX, nextY } = data;
                    if (Battle.id != battleId) return;
                    Battle.move(uid, nextX, nextY);
                    break;
                }
                case "unitDie": {
                    let { battleId, uid } = data;
                    if (Battle.id != battleId) return;
                    Battle.die(uid);
                    break;
                }
                case "unitItemUpdate": {
                    let { battleId, unit } = data;
                    if (Battle.id != battleId) return;
                    Battle.itemUpdate(unit);
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
                    UI.gameEnd();
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
