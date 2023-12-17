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
                case "resNewId":
                    this.id = data;
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
                    break;
                case "resBuyCat":
                    break;
                case "resPutCat":
                    break;
                case "resSellCat":
                    break;
                case "resReload":
                    let list = document.getElementById("shoppingList");
                    list.innerHTML = "";
                    for (let i = 0; i < data.length; i++) {
                        let wrapper = document.createElement("div");
                        wrapper.style.display = "flex";
                        wrapper.style.flexDirection = "column";
                        wrapper.style.alignItems = "center";
                        wrapper.style.justifyContent = "center";
                        let cost = document.createElement("span");
                        cost.innerHTML = data[i].cost + "코";
                        wrapper.appendChild(cost);
                        let name = document.createElement("span");
                        name.innerHTML = data[i].name;
                        wrapper.appendChild(name);
                        list.appendChild(wrapper);
                    }
                    break;
                case "expUpdate":
                    let exp = document.getElementById("curExp");
                    exp.innerHTML = data.exp;
                    break;
                case "levelUpdate":
                    if (data.player === Socket.id) {
                        let level = document.getElementById("level");
                        level.innerHTML = data.level;
                        let maxExp = document.getElementById("maxExp");
                        maxExp.innerHTML = data.level * 4;
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
