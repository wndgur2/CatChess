import Painter from "./modules/Painter.js";
import Socket from "./modules/Socket.js";
import UI from "./modules/UI.js";
import Unit from "./modules/Unit.js";

window.onload = () => {
    init();
};

function init() {
    Socket.init();
    Unit.fetchData().then(() => {
        UI.init();
        Painter.init();
    });
}
