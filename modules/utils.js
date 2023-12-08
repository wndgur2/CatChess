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
module.exports = { sendMsg, getNewId };
