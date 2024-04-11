import * as THREE from "three";
export default class Part {
    constructor(width, depth, height, position, rotation, image, size = 0.7) {
        this.width = width * size;
        this.depth = depth * size;
        this.height = height * size;
        this.geometry = new THREE.BoxGeometry(
            this.width,
            this.depth,
            this.height
        );

        //TODO
        const index = Math.floor((width + depth + height) * 100);
        console.log(index);
        const img = new Image();
        img.src = image;
        img.onload = (e) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const color = `#${normalizeColor(
                imageData.data[index * 4]
            )}${normalizeColor(imageData.data[index * 4 + 1])}${normalizeColor(
                imageData.data[index * 4 + 2]
            )}`;
            console.log(color);
            this.material.color = new THREE.Color(color);
        };

        this.material = new THREE.MeshBasicMaterial({
            color: "#000",
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = position.x * size;
        this.mesh.position.y = position.y * size;
        this.mesh.position.z = position.z * size;

        this.mesh.rotation.x = rotation.x;
        this.mesh.rotation.y = rotation.y;
        this.mesh.rotation.z = rotation.z;

        return this.mesh;
    }
}

function normalizeColor(n) {
    n = parseInt((n + 128) / 2);
    return n.toString(16).padStart(2, "0");
}
