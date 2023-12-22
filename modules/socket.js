const Player = require("./Player.js");
const Game = require("./Game.js");
const { sendMsg } = require("./utils.js");
const webSocket = require("ws");

module.exports = (server) => {
    const wss = new webSocket.Server({ server });

    wss.on("connection", (ws, req) => {
        console.log("새로운 클라이언트 접속");

        ws.on("message", (message) => {
            let msg = JSON.parse(message);
            let { from, type, data } = msg;
            console.log(msg);
            switch (type) {
                case "reqNewId":
                    sendMsg(ws, "resNewId", Player.getNewId());
                    break;
                case "startWaiting":
                    Game.newPlayer(from, ws);
                    break;
                case "reqBuyCat":
                    Player.getPlayer(from).buyCat(data.index);
                    break;
                case "reqPutCat":
                    if (!data.from) return;
                    let befX = data.from.x;
                    let befY = data.from.y === 3 ? data.from.y : data.from.y;

                    let to = data.to.split("-");
                    let nextY, nextX;
                    if (to[0] === "board") {
                        if (Player.getPlayer(from).game.state !== "arrange")
                            return;
                        nextY = to[1];
                        nextX = to[2];
                    } else {
                        nextY = 3;
                        nextX = to[1];
                    }

                    Player.getPlayer(from).putCat({ befX, befY, nextX, nextY });
                    break;
                case "reqSellCat":
                    break;
                case "reqReload":
                    Player.getPlayer(from).reload();
                    break;
                case "reqBuyExp":
                    Player.getPlayer(from).buyExp();
                    break;
                case "reqGiveItem":
                    break;
            }
        });

        ws.on("error", (error) => {
            console.error(error);
        });
        ws.on("close", () => {
            console.log("클라이언트 접속 해제");
        });
    });
};
