import Painter from "./modules/Painter.js";
import Socket from "./modules/Socket.js";
import UI from "./modules/UI.js";
import Unit from "./modules/Unit.js";

window.onload = () => {
    logDeviceInfo();
    init(isPlayableDevice());
};

async function init(playable) {
    Socket.init(playable);
    await fetchResource();
    UI.init();
    endLoading();
    if (playable) Painter.init();
}

async function fetchResource() {
    await Unit.fetchData();
    fetchImages();
}

async function fetchImages() {
    const data = Object.values(Unit.CATS).concat(Object.values(Unit.CREEPS));
    let count = 0;
    startLoading();
    data.forEach((unit) => {
        const img = new Image();
        img.src = `/images/portraits/${unit.id}.jpg`;
        img.onload = () => {
            document.querySelector(
                "#loadingText"
            ).innerHTML = `Fetching Data... ${count}/${data.length}`;
        };
        img.onerror = () => {
            console.log("Error fetching image.");
        };
    });
}

function startLoading() {
    document.querySelector("#loading").style.display = "flex";
}

function endLoading() {
    document.querySelector("#loading").style.display = "none";
}

function isPlayableDevice() {
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    if (isMobile) alert("Mobile devices are not supported.");
    return !isMobile;
}

function logDeviceInfo() {
    const browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language || navigator.userLanguage,
    };

    // fetch("/user/log/browser", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(browserInfo),
    // });
}
