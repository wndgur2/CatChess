import Battle from "./Battle.js";
import Game from "./Game.js";
import Player from "./Player.js";
import Socket from "./Socket.js";
import Painter from "./Painter.js";
import Sound from "./Sound.js";

export default class UI {
    static draggingId;
    static isDragging = false;
    static infoUnit;
    static muted = true;

    static init() {
        this.hydrate();
    }

    static hydrate() {
        document.onclick = (event) => {
            if (UI.muted) return;
            Sound.playBeep();
        };
        document.getElementById("deck").onclick = (event) => {
            const cards = document.getElementById("cards");
            if (cards.children.length > 4) {
                const i = cards.children.length - 5;
                cards.children[i].setAttribute(
                    "style",
                    "width: 0px; margin:0px; opacity: 0; pointer-events: none;"
                );
                setTimeout(() => {
                    if (cards.children.length > 4)
                        cards.removeChild(cards.children[0]);
                }, 600);
            }
            Socket.sendMsg("reqNewCard", {
                cards: [...cards.children].map((card) => card.id),
            });
        };
        document.getElementById("playBtn").addEventListener("click", () => {
            Socket.sendMsg("startMatching", "");
            const t = document.getElementById("matchingTime");
            t.innerHTML = "00:00";
            let matchingTime = 0;
            UI.interval = setInterval(() => {
                matchingTime++;
                const minute = Math.floor(matchingTime / 60);
                const second = matchingTime % 60;
                document.getElementById("matchingTime").innerHTML = `${
                    minute < 10 ? "0" + minute : minute
                }:${second < 10 ? "0" + second : second}`;
            }, 1000);

            this.openModal(
                document.getElementById("waiting").innerHTML,
                cancelMatching
            );
        });

        document
            .getElementById("fullscreenBtn")
            .addEventListener("click", () => {
                let elem = document.documentElement;
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    elem.requestFullscreen();
                }
            });

        document.getElementById("soundBtn").addEventListener("click", () => {
            let soundBtn = document.getElementById("soundBtn");
            if (UI.muted)
                soundBtn.innerHTML =
                    "<img id='soundImg' src='/images/home/sound.png' />";
            else
                soundBtn.innerHTML =
                    "<img id='soundImg' src='/images/home/mutedSound.png' />";
            UI.muted = !UI.muted;
        });

        document.getElementById("modalClose").addEventListener("click", () => {
            this.closeModal();
        });
        document
            .getElementById("modalBackdrop")
            .addEventListener("click", () => {
                this.closeModal();
            });

        document
            .getElementById("surrenderBtn")
            .addEventListener("click", () => {
                const surrenderEl = document.getElementById("surrenderWrapper");
                UI.openModal(surrenderEl.innerHTML);
            });

        document.getElementById("reload").addEventListener("click", () => {
            Socket.sendMsg("reqReload", "");
        });

        document.addEventListener("keypress", (event) => {
            if (event.key.toUpperCase() === "D")
                Socket.sendMsg("reqReload", "");
            else if (event.key.toUpperCase() === "F")
                Socket.sendMsg("reqBuyExp", "");
            else if (event.key.toUpperCase() === "E")
                Painter.sellUnitOnKeypress();
        });

        document.getElementById("buyExp").addEventListener("click", () => {
            Socket.sendMsg("reqBuyExp", "");
        });

        let shopEl = document.getElementById("shop");
        shopEl.addEventListener("mouseenter", shopMouseEnter);
        shopEl.addEventListener("mouseleave", shopMouseLeave);
        shopEl.addEventListener("pointerup", shopPointerUp);

        let shoplistEl = document.getElementById("shoplist");
        for (let i = 0; i < shoplistEl.children.length; ++i) {
            shoplistEl.children[i].addEventListener("click", () => {
                if (!Player.player.shop[i]) return;
                Socket.sendMsg("reqBuyCat", {
                    index: i,
                });
                UI.popDown();
            });
        }

        // 2 x 3 inventory
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                let item = document.getElementById(`inventory-${i}-${j}`);
                item.addEventListener("dragstart", inventoryDragStart);
                item.draggable = false;
                item.addEventListener("mousemove", inventoryItemMouseMove);
                item.addEventListener("mouseleave", inventoryItemMouseLeave);
            }
        }

        // unit info
        let itemEls = document.getElementsByClassName("item");
        for (let i = 0; i < itemEls.length; i++) {
            itemEls[i].addEventListener("mousemove", itemMouseMove);
            itemEls[i].addEventListener("mouseout", itemMouseLeave);
        }

        let skillEl = document.getElementById("unitSkillWrapper");
        skillEl.addEventListener("mousemove", skillMouseMove);
        skillEl.addEventListener("mouseout", skillMouseLeave);
    }

    static openModal(content, callback) {
        const modalEl = document.getElementById("modal");
        modalEl.style.opacity = "1";
        modalEl.style.visibility = "visible";

        const modalBodyEl = document.getElementById("modalBody");
        modalBodyEl.innerHTML = content;
        if (callback) UI.callback = callback;
    }

    static closeModal() {
        const modalEl = document.getElementById("modal");
        if (UI.callback) {
            UI.callback();
            UI.callback = null;
        }
        modalEl.style.opacity = "0";
        setTimeout(() => {
            modalEl.style.visibility = "hidden";
        }, 200);
    }

    static getCellUnitByCellId(id) {
        let position = id.split("-");

        switch (Game.state) {
            case "arrange":
                if (position[0] === "ally")
                    return Player.player.board[position[1]][position[2]];
                else return Player.player.queue[position[2]];
            default:
                if (position[0] === "ally")
                    return Battle.board[parseInt(position[1]) + 3][position[2]];
                else if (position[0] === "enemy")
                    return Battle.board[position[1]][position[2]];
                else return Player.player.queue[position[2]];
        }
    }

    static popUp(html, mouseEvent) {
        let popUpEl = document.getElementById("popUp");
        popUpEl.innerHTML = html;
        popUpEl.style.display = "flex";

        if (mouseEvent.clientX + popUpEl.clientWidth > window.innerWidth)
            popUpEl.style.left =
                mouseEvent.clientX - popUpEl.clientWidth + "px";
        else popUpEl.style.left = mouseEvent.clientX + "px";

        if (mouseEvent.clientY + popUpEl.clientHeight > window.innerHeight)
            popUpEl.style.top =
                mouseEvent.clientY - popUpEl.clientHeight + "px";
        else popUpEl.style.top = mouseEvent.clientY + "px";
    }

    static popDown() {
        let popUpEl = document.getElementById("popUp");
        popUpEl.style.display = "none";
    }

    static showUnitInfo(unit) {
        this.infoUnit = unit;
        let unitInfoEl = document.getElementById("unitInfo");
        unit.showInfo();
        unitInfoEl.style.display = "flex";

        let shopEl = document.getElementById("shop");
        shopEl.style.display = "none";
    }

    static hideUnitInfo() {
        let unitInfoEl = document.getElementById("unitInfo");
        unitInfoEl.style.display = "none";
        if (this.infoUnit) this.infoUnit.focused = false;
        this.infoUnit = null;

        let sellEl = document.getElementById("sell");
        sellEl.style.display = "none";

        let shoplistEl = document.getElementById("shoplist");
        shoplistEl.style.display = "flex";

        let shopEl = document.getElementById("shop");
        shopEl.style.display = "flex";
    }

    static gameStart() {
        UI.closeModal();
        document.getElementById("home").style.display = "none";
        document.getElementById("game").style.display = "flex";

        Painter.startRendering();
    }

    static gameEnd() {
        document.getElementById("game").style.display = "none";
        document.getElementById("home").style.display = "inline-block";
        Painter.clear();
    }

    static initCardOpener() {
        Socket.sendMsg("reqNewCard", "");
    }

    static newCard(cat) {
        let cardWrapper = document.createElement("div");
        cardWrapper.className = "cardWrapper";
        cardWrapper.id = cat.id;

        let card = document.createElement("div");
        card.className = "card";
        cardWrapper.appendChild(card);

        let cardImgWrapper = document.createElement("div");
        cardImgWrapper.className = "cardImgWrapper";
        card.appendChild(cardImgWrapper);

        let cardImg = document.createElement("img");
        cardImg.className = "cardImg";
        cardImg.src = `/images/units/${cat.id}.jpg`;
        cardImgWrapper.appendChild(cardImg);

        let cardDescWrapper = document.createElement("div");
        cardDescWrapper.className = "cardDescWrapper";

        let cardDesc = document.createElement("span");
        cardDesc.className = "cardDesc";
        cardDesc.innerHTML = cat.desc;
        cardDescWrapper.appendChild(cardDesc);

        card.appendChild(cardDescWrapper);

        let cards = document.getElementById("cards");
        cards.appendChild(cardWrapper);

        setTimeout(() => {
            cardWrapper.style.opacity = "1";
            cardWrapper.style.width = "13dvw";
            cardWrapper.onmouseover = (e) => {
                cardWrapper.style.width = "17.5dvw";
            };
            cardWrapper.onmouseout = (e) => {
                cardWrapper.style.width = "13dvw";
            };
        }, 100);
    }
}

function inventoryDragStart(event) {
    UI.draggingId = event.target.id;
    UI.isDragging = true;
}

function inventoryItemMouseMove(event) {
    let index =
        parseInt(this.id.split("-")[1]) * 2 + parseInt(this.id.split("-")[2]);
    if (Player.player.items[index])
        UI.popUp(Player.player.items[index].info(), event);
}

function inventoryItemMouseLeave(event) {
    UI.popDown();
}

function itemMouseMove(event) {
    if (UI.infoUnit.items[this.id])
        UI.popUp(UI.infoUnit.items[this.id].info(), event);
}

function itemMouseLeave(event) {
    UI.popDown();
}

function skillMouseMove(event) {
    UI.popUp(UI.infoUnit.skillInfo(), event);
}

function skillMouseLeave(event) {
    UI.popDown();
}

function shopMouseEnter(event) {
    if (!Painter.isDragging) return;
    event.preventDefault();

    let shoplistEl = document.getElementById("shoplist");
    shoplistEl.style.display = "none";

    let sellEl = document.getElementById("sell");
    sellEl.innerHTML = `고양이 판매하기 [E]<br/>💰${Painter.draggingObject.unit.cost}`;
    sellEl.style.display = "flex";
}

function shopMouseLeave(event) {
    if (!Painter.isDragging) return;
    event.preventDefault();

    let sellEl = document.getElementById("sell");
    sellEl.style.display = "none";

    let shoplistEl = document.getElementById("shoplist");
    shoplistEl.style.display = "flex";
}

function shopPointerUp(event) {
    if (!Painter.isDragging) return;
    Socket.sendMsg("reqSellCat", {
        uid: Painter.draggingObject.unit.uid,
    });

    let sellEl = document.getElementById("sell");
    sellEl.style.display = "none";

    let shoplistEl = document.getElementById("shoplist");
    shoplistEl.style.display = "flex";

    Player.player._shop = Player.player.shop;
}

function cancelMatching() {
    Socket.sendMsg("cancelMatching", "");
    clearInterval(UI.interval);
}
