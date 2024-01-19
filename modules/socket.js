const Player = require("./Player.js");
const Game = require("./Game.js");
const { sendMsg, getPlayer } = require("./utils.js");
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
                case "reqNewId": {
                    sendMsg(ws, "resNewId", Player.getNewId());
                    break;
                }
                case "startWaiting": {
                    Game.newPlayer(from, ws);
                    break;
                }
                case "reqBuyCat": {
                    getPlayer(from).buyCat(data.index);
                    break;
                }
                case "reqPutCat": {
                    if (!data.from) return;
                    let player = getPlayer(from);
                    if (data.to.y <= 2 && player.game.state !== "arrange")
                        return;
                    player.putCat(data.from, data.to);
                    break;
                }
                case "reqSellCat": {
                    getPlayer(from).sellCat(data.cat);
                    break;
                }
                case "reqReload": {
                    getPlayer(from).reload();
                    break;
                }
                case "reqBuyExp": {
                    getPlayer(from).buyExp();
                    break;
                }
                case "reqGiveItem": {
                    getPlayer(from).giveItem(data.item, data.to);
                    break;
                }
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
