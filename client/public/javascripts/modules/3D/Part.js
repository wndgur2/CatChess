import * as THREE from "three";
export default class Part {
    constructor(width, depth, height, position, rotation, images) {
        const scale = 0.6;
        this.width = width * scale;
        this.depth = depth * scale;
        this.height = height * scale;
        this.geometry = new THREE.BoxGeometry(
            this.width,
            this.depth,
            this.height
        );

        // this.materials = [];
        // images.forEach((image) => {
        //     const texture = new THREE.TextureLoader().load(image);
        //     this.materials.push(new THREE.MeshBasicMaterial({ map: texture }));
        // });
        // this.mesh = new THREE.Mesh(this.geometry, this.materials);

        this.material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(images),
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = position.x * scale;
        this.mesh.position.y = position.y * scale;
        this.mesh.position.z = position.z * scale;

        this.mesh.rotation.x = rotation.x;
        this.mesh.rotation.y = rotation.y;
        this.mesh.rotation.z = rotation.z;

        return this.mesh;
    }
}
