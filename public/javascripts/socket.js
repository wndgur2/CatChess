const initSocket = () => {
    const webSocket = new WebSocket('ws://localhost:3000');
    webSocket.onopen = function(event) {
        console.log('웹 소켓 연결 성공');
        shopReload();
    }
    webSocket.onclose = function(event) {
        console.log('웹 소켓 연결 해제');
    }
    webSocket.onerror = function(event) {
        console.error(event);
    }
    webSocket.onmessage = function(event) {
        let msg = JSON.parse(event.data);
        console.log(msg);
        let {type, data} = msg;
        switch(type){
            case 'yourIpIs':
                let myIp = document.getElementById("myIp");
                myIp.innerHTML = data;
                break;
            case 'shopReload':
                let shoppingList = document.getElementById("shoppingList");
                shoppingList.innerHTML = "";
                data.forEach(function(cat){
                    let newUnit = document.createElement("button");
                    newUnit.classList.add("saleUnit");
                    newUnit.innerHTML = `<span>${cat}</span>`;
                    shoppingList.appendChild(newUnit);
                });
                break;
            default:
                break;
        }
    }

    return webSocket;
}

function shopReload(){
    socket.send(JSON.stringify({
        type: 'shopReload',
        data: ""
    }));
}