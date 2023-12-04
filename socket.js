const webSocket = require('ws');

let players = [];

module.exports = (server) => {
    const wss = new webSocket.Server({ server });
    
    wss.on('connection', (ws, req) => {
        const ip = ws._socket.remoteAddress || req.socket.remoteAddress || req.headers['x-forwarded-for'];
        console.log('새로운 클라이언트 접속', ip);
        ws.send(JSON.stringify({
            type:'yourIpIs',
            data:ip
        }));
        players.push(ws);
        // console.log(players);
    
        ws.on('message', (message) => {
            let msg = JSON.parse(message);
            console.log("수신된 메시지", msg);
            let {type, data} = msg;
            switch(type){
                case 'shopReload':
                    let newCats = [];
                    for(let i = 0; i < 4; i++){
                        newCats.push(getRandomCat());
                    }
                    players.forEach((player) => {
                        player.send(JSON.stringify({type:'shopReload', data:newCats}));
                    });
                    break;
            }
        });
    
        ws.on('error', (error) => {
            console.error(error);
        });
    
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            players = players.filter((player) => player !== ws);
        });
    });
}

function getRandomCat(){
    return Math.floor(Math.random() * 20);
}