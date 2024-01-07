let players = [];

function sendMsg(ws, type, data) {
    ws.send(
        JSON.stringify({
            type,
            data,
        })
    );
}

function addPlayer(player) {
    players.push(player);
}

function getPlayer(id) {
    return players.find((player) => player.id === id);
}

function removePlayer(id) {
    players = players.filter((player) => player.id !== id);
}

module.exports = { sendMsg, addPlayer, getPlayer, removePlayer };
