const Player = require("./Player.js");
const Game = require("./Game.js");
const { sendMsg, getPlayerById, getPlayerByWs } = require("./utils.js");
const webSocket = require("ws");
const { client } = require("../db/connection.js");

module.exports = (server) => {
    const wss = new webSocket.Server({ server });

    wss.on("connection", (ws, req) => {
        console.log("New client connected");
        // getMovies()
        //     .catch(console.error)
        //     .then((res) => console.log(res));

        ws.on("message", (message) => {
            let msg = JSON.parse(message);
            let { from, type, data } = msg;
            console.log(msg);
            try {
                switch (type) {
                    case "reqNewId": {
                        sendMsg(ws, "resNewId", Player.getNewId());
                        break;
                    }
                    case "startMatching": {
                        Game.startMatching(from, ws);
                        break;
                    }
                    case "cancelMatching": {
                        Game.cancelMatching(from);
                        break;
                    }
                    case "surrender": {
                        const p = getPlayerById(from);
                        if (p) p.surrender();
                        break;
                    }
                    case "reqBuyCat": {
                        const p = getPlayerById(from);
                        if (p) p.buyCat(data.index);
                        break;
                    }
                    case "reqPutCat": {
                        const p = getPlayerById(from);
                        if (p) p.putCat(data.uid, data.to);
                        break;
                    }
                    case "reqSellCat": {
                        const p = getPlayerById(from);
                        if (p) p.sellCat(data.uid);
                        break;
                    }
                    case "reqReload": {
                        const p = getPlayerById(from);
                        if (p) p.reload();
                        break;
                    }
                    case "reqBuyExp": {
                        const p = getPlayerById(from);
                        if (p) p.buyExp();
                        break;
                    }
                    case "reqGiveItem": {
                        const p = getPlayerById(from);
                        if (p) p.giveItem(data.item, data.uid);
                        break;
                    }
                }
            } catch (e) {
                console.error(e);
            }
        });

        ws.on("error", (error) => {
            console.error(error);
        });

        ws.on("close", () => {
            console.log("Client disconnected");
            const p = getPlayerByWs(ws);
            if (p) {
                if (Game.matchingPlayers.includes(p)) {
                    Game.cancelMatching(p.id);
                    console.log("Matching canceled", Game.matchingPlayers);
                }
            }
        });
    });
};

async function getMovies() {
    await client.connect();
    return await client
        .db("sample_mflix")
        .collection("movies")
        .findOne({ title: "Back to the Future" });
}
