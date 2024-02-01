import Game from "./Game.js";
import Item from "./Item.js";
import Painter from "./Painter.js";
import { GAME_STATES } from "./constants/CONSTS.js";
import attackMotion from "./motions/attack.js";

class Battle {
    static board = [];

    static ready(reversed) {
        this.reversed = reversed;
        if (reversed)
            Battle.board = Battle.board.map((row) => row.reverse()).reverse();
        this.board.forEach((row) => {
            row.forEach((cat) => {
                if (!cat) return;
                cat.inBattle = true;
            });
        });
        Painter._board = Battle.board;
    }

    static getCatByUid(uid) {
        let cat;
        this.board.forEach((row) => {
            row.forEach((c) => {
                if (!c) return;
                if (c.uid == uid) cat = c;
            });
        });
        return cat;
    }

    static init(timeStep) {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (Game.state !== GAME_STATES.BATTLE) {
                clearInterval(this.interval);
                return;
            }
            this.board.forEach((row) => {
                row.forEach((cat) => {
                    if (!cat) return;
                    cat._mp = cat.mp + 1;
                });
            });
        }, timeStep);
    }

    static attack(attacker, target, damage) {
        let attackerCat = this.getCatByUid(attacker.uid);
        let targetCat = this.getCatByUid(target.uid);

        attackMotion(attackerCat, targetCat);

        targetCat._hp = parseInt(target.hp);

        Painter.hitEffect(attackerCat, targetCat, damage);
    }

    static die(uid) {
        let cat = this.getCatByUid(uid);
        cat.die();
        Battle.board[this.reversed ? 5 - cat.y : cat.y][
            this.reversed ? 4 - cat.x : cat.x
        ] = null;
    }

    static move(uid, nextX, nextY) {
        let cat = this.getCatByUid(uid);
        const beforeX = cat.x;
        const beforeY = cat.y;
        cat.move(nextX, nextY);

        if (this.reversed) {
            Battle.board[5 - beforeY][4 - beforeX] = null;
            Battle.board[5 - nextY][4 - nextX] = cat;
        } else {
            Battle.board[beforeY][beforeX] = null;
            Battle.board[nextY][nextX] = cat;
        }
        cat.x = nextX;
        cat.y = nextY;
    }

    static useSkill(uid) {
        let cat = this.getCatByUid(uid);
        cat._mp = cat.mp - cat.maxMp;
    }

    static itemUpdate(data) {
        let unit = this.getCatByUid(data.uid);
        unit.items = data.items.map((item) => new Item(item));
        Painter.createItemMesh(unit);
    }
}
export default Battle;
