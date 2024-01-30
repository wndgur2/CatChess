import Battle from "./Battle.js";
import Game from "./Game.js";
import { GAME_STATES } from "./constants/CONSTS.js";
import { COORDINATES } from "./constants/THREE_CONSTS.js";

function getBoardCoords(x, y) {
    switch (Game.state) {
        case GAME_STATES.ARRANGE:
            return [...COORDINATES.BOARD[y + 3][x]];
        case GAME_STATES.FINISH:
            return [...COORDINATES.BOARD[y + 3][x]];
        case GAME_STATES.BATTLE:
            return Battle.reversed
                ? [...COORDINATES.BOARD[5 - y][4 - x]]
                : [...COORDINATES.BOARD[y][x]];
        case GAME_STATES.READY:
            return Battle.reversed
                ? [...COORDINATES.BOARD[5 - y][4 - x]]
                : [...COORDINATES.BOARD[y][x]];
        default:
            console.log("getBoardCoords: invalid state");
            return [0, 0, 0];
    }
}

export { getBoardCoords };
