import * as THREE from "three";
import { CAT_PARTS } from "../constants/threeConsts.js";
import Part from "./Part.js";
export default class Cat {
    constructor(unit) {
        this.mesh = new THREE.Group();
        Object.values(CAT_PARTS).forEach((part) => {
            // TODO: textures
            this.mesh.add(
                new Part(
                    part.width,
                    part.height,
                    part.depth,
                    part.position,
                    part.rotation,
                    `/images/portraits/${unit.id}.jpg`,
                    calcSize(unit)
                )
            );
        });
        return this.mesh;
    }
}

function calcSize(unit) {
    let size = 0.7;
    size *= ((unit.maxHp * Math.sqrt(unit.armor)) / 300 + 7) / 8;
    size = Math.min(size, 1.2);
    size = Math.max(size, 0.5);
    return size;
}
