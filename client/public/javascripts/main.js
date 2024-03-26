import Painter from "./modules/Painter.js";
import Socket from "./modules/Socket.js";
import UI from "./modules/UI.js";
import Unit from "./modules/Unit.js";

window.onload = () => {
    init();
};

async function init() {
    Socket.init();
    await fetchResource();
    UI.init();
    endLoading();
    Painter.init();
}

async function fetchResource() {
    await Unit.fetchData();
    fetchImages();
}

async function fetchImages() {
    const data = Object.keys(Unit.CATS).concat(Object.keys(Unit.CREEPS));
    let count = 0;
    startLoading();
    data.forEach((key) => {
        const img = new Image();
        img.src = `/images/portraits/${key}.jpg`;
        img.onload = () => {
            document.querySelector(
                "#loadingText"
            ).innerHTML = `Fetching Data... ${count}/${data.length}`;
        };
    });
}

function startLoading() {
    document.querySelector("#loading").style.display = "flex";
}

function endLoading() {
    document.querySelector("#loading").style.display = "none";
}