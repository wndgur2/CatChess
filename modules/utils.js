function sendMsg(ws, type, data) {
    ws.send(
        JSON.stringify({
            type,
            data,
        })
    );
}

module.exports = { sendMsg };
