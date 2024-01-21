import Item from "./Item.js";
import Painter from "./Painter.js";
import { COST_COLORS } from "./constants/CONSTS.js";
import { HEALTHBAR_WIDTH } from "./constants/THREE_CONSTS.js";
import { getBoardCoords } from "./untils.js";

export default class Unit {
    constructor(data) {
        this.id = data.id;
        this.tier = data.tier;
        this.name = data.name;
        this.desc = data.desc;
        this.ad = data.ad;
        this.speed = data.speed;
        this.range = data.range;
        this.maxHp = data.maxHp;
        this.hp = data.hp;
        this.armor = data.armor;
        this.originalCost = data.originalCost;
        this.cost = data.cost;
        this.owner = data.owner;
        this.items = data.items.map((item) => (item ? new Item(item) : null));

        this.x = data.x;
        this.y = data.y;

        Painter.createUnitMesh(this);
        this.draggable = true;

        // load image from images/units/this.id.jpg
        this.image = `<img id="catImg" src="/images/units/${this.id}.jpg" />`;
        this.color = COST_COLORS[this.originalCost];
    }

    die() {
        Painter.scene.remove(this.mesh);
    }

    info() {
        return `
            <div id="catIntro">
                <div id="catImgWrapper">${this.image}</div>
                <span id="catName" style="color:${this.color};">
                    ${"★".repeat(this.tier)} ${this.name}
                </span>
            </div>
            <div class="catStats">
                <div>💰${this.cost}</div>
                <div>♥️${this.maxHp}</div>
                <div>⚔️${this.ad}</div>
            </div>

            <div class="catStats">
                <div>🛡${this.armor}</div>
                <div>🎯${this.range}</div>
                <div>🏃${this.speed}</div>
            </div>
            <div id="catSkills">
                <div class="catSkill" style="background-color:#FF0000;">
                    passive
                </div>
                <div class="catSkill" style="background-color:#0000FF;">
                    active
                </div>
            </div>
            <div id="catItems">
                <div>item1</div>
                <div>item2</div>
                <div>item3</div>
            </div>
        `;
    }

    set _hp(newHp) {
        this.hp = newHp < 0 ? 0 : newHp;

        const healthBarMesh = this.mesh.getObjectByName("healthBar");
        healthBarMesh.scale.x = this.hp / this.maxHp;
        healthBarMesh.position.x =
            ((1 - this.hp / this.maxHp) * HEALTHBAR_WIDTH) / 2;

        const damagedHealthMesh = this.mesh.getObjectByName("damagedHealth");

        function animateHealthDamage() {
            if (damagedHealthMesh.scale.x > healthBarMesh.scale.x) {
                damagedHealthMesh.scale.x -= 0.01;
                damagedHealthMesh.position.x =
                    ((1 - damagedHealthMesh.scale.x) * HEALTHBAR_WIDTH) / 2;
                requestAnimationFrame(animateHealthDamage);
            } else {
                damagedHealthMesh.scale.x = healthBarMesh.scale.x;
                damagedHealthMesh.position.x =
                    ((1 - damagedHealthMesh.scale.x) * HEALTHBAR_WIDTH) / 2;
            }
        }

        animateHealthDamage();
    }

    move(beforeX, beforeY, nextX, nextY) {
        const beforeCoords = getBoardCoords(beforeX, beforeY);
        const nextCoords = getBoardCoords(nextX, nextY);

        const toMoveCoords = {
            x: nextCoords[0] - beforeCoords[0],
            z: nextCoords[2] - beforeCoords[2],
        };
        const duration = 240 / this.speed;

        let i = duration;
        const animateMove = () => {
            if (i-- <= 0) return;
            this.mesh.position.x += toMoveCoords.x / duration;
            this.mesh.position.z += toMoveCoords.z / duration;
            requestAnimationFrame(animateMove);
        };

        animateMove();
    }
}
