const Player = require("./modules/Player.js");
const Game = require("./modules/Game.js");
const { sendMsg, getNewId, reloadCats } = require("./modules/utils.js");
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
                case "getNewId":
                    sendMsg(ws, "yourIdIs", getNewId());
                    break;
                case "getGameData":
                    Game.getGameData(from);
                    break;
                case "startWaiting":
                    Game.newPlayer(from, ws);
                    break;
                case "reqBuyCat":
                    Player.getPlayer(from).buyCat(data);
                    break;
                case "reqPutCat":
                    Player.getPlayer(from).putCat(data);
                    break;
                case "reqSellCat":
                    break;
                case "reqReload":
                    sendMsg(ws, "reloadedCats", reloadCats(data));
                    break;
                case "reqBuyExp":
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
