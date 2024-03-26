const Player = require("./Player");

let players = [];

function sendMsg(ws, type, data) {
    ws.send(
        JSON.stringify({
            type,
            data,
        })
    );
}

/**
 * 플레이어 생명주기 : (게임 매칭 요청) ~ (해당 게임 종료)
 * @returns {Player}
 */
function getPlayerById(id) {
    return players.find((player) => player.id === id);
}

function getPlayerByWs(ws) {
    return players.find((player) => player.ws === ws);
}

function addPlayer(player) {
    players.push(player);
}

function removePlayer(id) {
    players = players.filter((player) => player.id !== id);
}

module.exports = {
    sendMsg,
    addPlayer,
    getPlayerById,
    getPlayerByWs,
    removePlayer,
};
