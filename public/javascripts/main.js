import { SimpleCat } from "./SimpleCat.js";
let socket;
const waits = document.getElementById("waits");

window.onload = function() {
    init();
}

function init(){
    socket = initSocket();
    document.getElementById("reload")
    .addEventListener("click", function(){
        shopReload();
    });
}

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
        const msg = JSON.parse(event.data);
        console.log(msg);
        const {type, data} = msg;
        switch(type){
            case 'yourIpIs':
                let myIp = document.getElementById("myIp");
                myIp.innerHTML = data;
                break;
            case 'newShoppingList':
                setShoppingList(data);
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

function setShoppingList(data){
    let shoppingList = document.getElementById("shoppingList");
    shoppingList.innerHTML = "";
    data.forEach((catId) => {
        let cat = new SimpleCat(catId);
        let catDiv = document.createElement("div");
        catDiv.classList.add("cat");
        catDiv.addEventListener("click", function(){
            buyCat(cat);
        });
        let catName = document.createElement("button");
        catName.innerHTML = cat.name;
        catDiv.appendChild(catName);
        shoppingList.appendChild(catDiv);
    });
}

function buyCat(cat){
    socket.send(JSON.stringify({
        type: 'buyCat',
        data: cat
    }));
}