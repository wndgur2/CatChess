import Game from "./Game.js";
import Item from "./Item.js";
import Painter from "./3D/Painter.js";
import Player from "./Player.js";
import { GAME_STATES } from "./constants/consts.js";

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
                cat.mp = 0;
            });
        });
        Painter._board = Battle.board;

        Player.players.forEach((p) => (p.damageChart = {}));
        document.getElementById("damage").innerHTML = "";
    }

    static getUnitByUid(uid) {
        let unit;
        this.board.forEach((row) => {
            row.forEach((u) => {
                if (!u) return;
                if (u.uid == uid) unit = u;
            });
        });
        return unit;
    }

    static attack(attacker, target, damage) {
        let attackerCat = this.getUnitByUid(attacker.uid);
        let targetCat = this.getUnitByUid(target.uid);
        if (!attackerCat || !targetCat) return;

        attackerCat.attack(targetCat);

        targetCat._hp = parseInt(target.hp);

        Painter.hitEffect(attackerCat, targetCat, damage);
        if (attackerCat.owner === Player.player.id)
            Player.getPlayerById(attackerCat.owner).updateDamage(
                attackerCat,
                damage
            );
    }

    static die(uid) {
        let cat = this.getUnitByUid(uid);
        if (!cat) return;
        cat.die();
        Battle.board[this.reversed ? 5 - cat.y : cat.y][
            this.reversed ? 4 - cat.x : cat.x
        ] = null;
    }

    static move(uid, nextX, nextY) {
        let cat = this.getUnitByUid(uid);
        if (!cat) return;

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

    static cast(uid) {
        let cat = this.getUnitByUid(uid);
        if (!cat) return;
        cat._mp = cat.mp - cat.maxMp;
        cat.cast();
    }

    static manaGen(uid, mp) {
        let cat = this.getUnitByUid(uid);
        if (!cat) return;
        cat._mp = mp;
    }

    static itemUpdate(data) {
        let unit = this.getUnitByUid(data.uid);
        unit.items = data.items.map((item) => new Item(item));
        Painter.createItemMesh(unit);
    }
}
export default Battle;
