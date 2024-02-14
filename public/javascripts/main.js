import Painter from "./modules/Painter.js";
import Socket from "./modules/Socket.js";
import UI from "./modules/UI.js";

window.onload = () => {
    init();
};

function init() {
    Socket.init();
    UI.init();
    Painter.init();
}
