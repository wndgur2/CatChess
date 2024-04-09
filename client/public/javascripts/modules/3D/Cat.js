import * as THREE from "three";
export default class Cat {
    constructor(parts) {
        this.mesh = new THREE.Group();
        parts.forEach((part) => {
            this.mesh.add(part);
        });
        return this.mesh;
    }
}
