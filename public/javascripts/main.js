let socket,
    id = null,
    money;
const waits = document.getElementById("waits");
const shoppingList = document.getElementById("shoppingList");
let players = [];

window.onload = function () {
    init();
};

function init() {
    id = localStorage.getItem("id");
    document.getElementById("myId").innerHTML = id;
    socket = initSocket();
}

const initSocket = () => {
    const webSocket = new WebSocket("ws://localhost:3000");
    webSocket.onopen = function (event) {
        console.log("웹 소켓 연결 성공");
        sendMsg("init", null);
    };

    webSocket.onmessage = function (event) {
        const msg = JSON.parse(event.data);
        console.log(msg);
        const { type, data } = msg;
        switch (type) {
            case "yourIdIs":
                id = data;
                document.getElementById("myId").innerHTML = data;
                localStorage.setItem("id", data);
                break;
            case "newPlayerConnected":
                let cur = document.getElementById("currentPlayers");
                cur.innerHTML = data + "명";
                break;
            case "gameMatched":
                initGame();
                break;
            case "newShoppingList":
                setShoppingList(data);
                break;
            default:
                break;
        }
    };

    webSocket.onclose = function (event) {
        console.log("웹 소켓 연결 해제");
    };
    webSocket.onerror = function (event) {
        console.error(event);
    };
    return webSocket;
};

function sendMsg(type, data) {
    socket.send(
        JSON.stringify({
            from: id,
            type: type,
            data: data,
        })
    );
}

function shopReload() {
    sendMsg("shopReload", "");
}

function setShoppingList(data) {
    shoppingList.innerHTML = "";
    data.forEach((catId) => {
        let cat = new window.SimpleCat(catId);
        let catDiv = document.createElement("div");
        catDiv.classList.add("cat");
        catDiv.addEventListener("click", function () {
            buyCat(catId);
        });
        let catName = document.createElement("button");
        catName.innerHTML = cat.name;
        catDiv.appendChild(catName);
        shoppingList.appendChild(catDiv);
    });
}

function buyCat(catId) {
    sendMsg("buyCat", catId);
}

function initGame() {
    document.getElementById("game").style.display = "flex";
    document.getElementById("waiting").style.display = "none";
}

function enterGame() {
    sendMsg("addPlayer", "");
    document.getElementById("home").style.display = "none";
    document.getElementById("waiting").style.display = "flex";
}
