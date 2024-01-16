import * as THREE from "three";

export default class ThreeManager {
    static initScene() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.camera.position.set(0, -64, 192);
        this.camera.lookAt(0, -24, 0);
        this.scene.add(this.camera);

        let light = new THREE.HemisphereLight(0xffffff, 0x000000, 2);
        light.position.set(0, 0, 100);
        this.scene.add(light);

        // const dirLight = new THREE.DirectionalLight(0xffffff, 5);
        // dirLight.position.set(0, 0, 700);
        // this.scene.add(dirLight);

        const pointLight = new THREE.PointLight(0xffffff, 100);
        pointLight.position.set(7, -5, -5);
        this.scene.add(pointLight);

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

        const sphere = new THREE.SphereGeometry(20, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
        this.scene.add(this.sphereMesh);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = "scene";
        this.renderer.setClearColor(0x81ecec, 0.5);
        document.body.appendChild(this.renderer.domElement);

        window.onresize = () => {
            ThreeManager.camera.aspect = window.innerWidth / window.innerHeight;
            ThreeManager.camera.updateProjectionMatrix();
            ThreeManager.renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );
        };

        this.renderer.render(this.scene, this.camera);
        this.animate();
    }

    static animate() {
        requestAnimationFrame(ThreeManager.animate);
        ThreeManager.renderer.render(ThreeManager.scene, ThreeManager.camera);
    }
}
