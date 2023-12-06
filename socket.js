const Player = require("./public/modules/Player.js");
const Game = require("./public/modules/Game.js");
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
                    if (from) return;
                    let id = getNewId();
                    sendMsg(ws, "yourIdIs", id);
                    break;
                case "addPlayer":
                    if (!from) return;
                    waitingPlayers.push(new Player(from, ws));
                    waitingPlayers.forEach((player) => {
                        sendMsg(
                            player.ws,
                            "newPlayerConnected",
                            waitingPlayers.length
                        );
                    });
                    if (waitingPlayers.length >= 3) {
                        waitingPlayers.forEach((player) => {
                            sendMsg(player.ws, "gameMatched", null);
                        });
                        let game = new Game(waitingPlayers.splice(0, 3));
                        games.push(game);
                        game.start();
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

function sendMsg(ws, type, data) {
    ws.send(
        JSON.stringify({
            from: "server",
            type,
            data,
        })
    );
}

function getNewId() {
    let id = "";
    // do {
    id = Math.random().toString(36).substr(2, 11);
    // } while (players.find((player) => player.id === id));
    return id;
}
