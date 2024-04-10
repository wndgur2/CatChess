import * as THREE from "three";
import { CAT_PARTS } from "../constants/CONSTS.js";
import Part from "./Part.js";
export default class Cat {
    constructor(id) {
        this.mesh = new THREE.Group();
        Object.values(CAT_PARTS).forEach((part) => {
            // TODO: bitmap 활용해서 각 파트에 맞는 이미지 주기
            this.mesh.add(
                new Part(
                    part.width,
                    part.height,
                    part.depth,
                    part.position,
                    part.rotation,
                    `/images/portraits/${id}.jpg`
                )
            );
        });
        return this.mesh;
    }
}
