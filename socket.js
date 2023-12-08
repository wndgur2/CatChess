const Player = require("./modules/Player.js");
const Game = require("./modules/Game.js");
const { sendMsg, getNewId } = require("./modules/utils.js");
const webSocket = require("ws");

let waitingPlayers = [];
let games = [];

module.exports = (server) => {
    const wss = new webSocket.Server({ server });

    wss.on("connection", (ws, req) => {
        console.log("새로운 클라이언트 접속");

        ws.on("message", (message) => {
            let msg = JSON.parse(message);
            let { from, type, data } = msg;
            console.log(msg);
            switch (type) {
                case "init":
                    let id;
                    if (from) {
                        id = from;
                        games.forEach((game) => {
                            game.players.forEach((player) => {
                                if (player.id === id) {
                                    sendMsg(
                                        ws,
                                        "gameData",
                                        JSON.stringify(game.getGameData())
                                    );
                                }
                            });
                        });
                    } else {
                        id = getNewId();
                    }
                    sendMsg(ws, "yourIdIs", id);
                    break;
                case "addPlayer":
                    if (!from) return;
                    waitingPlayers.push(new Player(from, ws));
                    waitingPlayers.forEach((player) => {
                        sendMsg(player.ws, "newPlayer", waitingPlayers.length);
                    });
                    if (waitingPlayers.length >= 1) {
                        let game = new Game(waitingPlayers.splice(0, 3));
                        game.players.forEach((player) => {
                            sendMsg(
                                player.ws,
                                "gameMatched",
                                game.players.map((player) => player.id)
                            );
                        });
                        games.push(game);
                    }
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
