import Battle from "./Battle.js";
import Game from "./Game.js";
import { GAME_STATES } from "./constants/CONSTS.js";
import THREE_CONSTS from "./constants/THREE_CONSTS.js";

function getBoardCoords(x, y) {
    switch (Game.state) {
        case GAME_STATES.ARRANGE:
            return [...THREE_CONSTS.COORDINATES.BOARD[y + 3][x]];
        case GAME_STATES.FINISH:
            return [...THREE_CONSTS.COORDINATES.BOARD[y + 3][x]];
        case GAME_STATES.BATTLE:
            return Battle.reversed
                ? [...THREE_CONSTS.COORDINATES.BOARD[5 - y][4 - x]]
                : [...THREE_CONSTS.COORDINATES.BOARD[y][x]];
        case GAME_STATES.READY:
            return Battle.reversed
                ? [...THREE_CONSTS.COORDINATES.BOARD[5 - y][4 - x]]
                : [...THREE_CONSTS.COORDINATES.BOARD[y][x]];
        default:
            console.log("getBoardCoords: invalid state");
            return [0, 0, 0];
    }
}

export { getBoardCoords };
