import * as THREE from "three";

export default class ThreeManager {
    static initScene() {
        this.scene = new THREE.Scene({
            antialias: true,
        });

        this.camera = new THREE.PerspectiveCamera(
            100,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.set(0, -52, 96);
        this.camera.lookAt(0, -28, 0);
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = "scene";
        document.getElementById("game").appendChild(this.renderer.domElement);

        window.addEventListener("resize", () => {
            this.camera.aspect = window.innerHeight / window.innerWidth;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        let light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
        light.position.set(0, 0, 100);
        this.scene.add(light);

        const boxWidth = 30;
        const boxHeight = 24;
        const boxDepth = 14;

        let cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x912431 });
        // 5 x 6 board
        for (let i = 0; i < 30; ++i) {
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            const y = parseInt(i / 5);
            const x = i % 5;
            cube.translateY(y * (boxHeight + 1) - (5 * (boxHeight + 1)) / 2);
            cube.translateX(x * (boxWidth + 1) - (4.5 * (boxWidth + 1)) / 2);
            if (y % 2 != 0) cube.translateX((boxWidth + 1) / 2);
            this.scene.add(cube);
        }

        const smallBoxWidth = 28;
        const smallBoxHeight = 20;
        const smallBoxDepth = 14;

        let smallCubeGeometry = new THREE.BoxGeometry(
            smallBoxWidth,
            smallBoxHeight,
            smallBoxDepth
        );

        // 1 x 7 queue
        cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x283482 });
        let y = -((boxHeight + 1) * 3.5) + (boxHeight - smallBoxHeight) / 2;
        for (let i = 0; i < 7; i++) {
            const cube = new THREE.Mesh(smallCubeGeometry, cubeMaterial);
            cube.translateY(y);
            cube.translateX(
                i * (smallBoxWidth + 1) - (6 * (smallBoxWidth + 1)) / 2
            );
            this.scene.add(cube);
        }

        cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x238742 });
        y = (boxHeight + 1) * 3.5 - (boxHeight - smallBoxHeight) / 2;
        for (let i = 0; i < 7; i++) {
            const cube = new THREE.Mesh(smallCubeGeometry, cubeMaterial);
            cube.translateY(y);
            cube.translateX(
                i * (smallBoxWidth + 1) - (6 * (smallBoxWidth + 1)) / 2
            );
            this.scene.add(cube);
        }
    }

    static animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }
}
