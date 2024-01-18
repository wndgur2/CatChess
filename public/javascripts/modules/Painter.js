import * as THREE from "three";
import { GAME_STATES } from "./constants/CONSTS.js";
import {
    BOX_DEPTH,
    BOX_HEIGHT,
    BOX_WIDTH,
    COORDINATES,
    PLATE_HEIGHT,
    PLATE_RADIUS,
} from "./constants/THREE_CONSTS.js";
import Game from "./Game.js";
import Battle from "./Battle.js";
import Player from "./Player.js";

export default class Painter {
    static board = new Array(6).fill(null).map(() => new Array(5).fill(null));
    static allyQueue = new Array(7).fill(null);
    static enemyQueue = new Array(7).fill(null);
    static isDragging = false;
    static draggingObject = null;

    static initScene() {
        this.scene = new THREE.Scene();

        // camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 168, -168);
        this.camera.lookAt(0, 0, -46);
        this.scene.add(this.camera);

        // light
        const light = new THREE.HemisphereLight(0xffffff, 0x000000, 3);
        light.position.set(0, 100, 0);
        this.scene.add(light);

        // board & queue
        this.drawPlates();

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = "scene";
        this.renderer.setClearColor(0x81ecec, 0.5);
        document.getElementById("game").appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
        this.animate();

        // interaction
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        window.addEventListener("resize", onResize);
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    }

    static animate() {
        requestAnimationFrame(Painter.animate);
        Painter.renderer.render(Painter.scene, Painter.camera);
    }

    static drawPlates() {
        // floor
        const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
        const floorMaterial = new THREE.MeshLambertMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotateX(Math.PI / 2);
        floor.position.set(0, 0, 0);
        floor.visible = false;
        floor.name = "floor";
        this.scene.add(floor);

        // board
        let plateGeometry = new THREE.CylinderGeometry(
            PLATE_RADIUS,
            PLATE_RADIUS,
            PLATE_HEIGHT,
            6
        );
        let material = new THREE.MeshLambertMaterial({ color: 0x914461 });

        COORDINATES.BOARD.forEach((row, i) => {
            row.forEach((coord) => {
                const plate = new THREE.Mesh(plateGeometry, material);
                plate.translateX(coord[0]);
                plate.translateY(coord[1]);
                plate.translateZ(coord[2]);
                if (i >= 3) plate.name = "plate";
                this.scene.add(plate);
            });
        });

        // queue
        const boxGeometry = new THREE.BoxGeometry(
            BOX_WIDTH,
            BOX_HEIGHT,
            BOX_DEPTH
        );

        // 1 x 7 ally queue
        material = new THREE.MeshLambertMaterial({ color: 0x489462 });

        COORDINATES.ALLY_QUEUE.forEach((coord) => {
            const cube = new THREE.Mesh(boxGeometry, material);
            cube.translateX(coord[0]);
            cube.translateY(coord[1]);
            cube.translateZ(coord[2]);
            cube.name = "plate";
            this.scene.add(cube);
        });

        // 1 x 7 enemy queue
        material = new THREE.MeshLambertMaterial({ color: 0x734742 });
        COORDINATES.ENEMY_QUEUE.forEach((coord) => {
            const cube = new THREE.Mesh(boxGeometry, material);
            cube.translateX(coord[0]);
            cube.translateY(coord[1]);
            cube.translateZ(coord[2]);
            this.scene.add(cube);
        });
    }

    static set _board(newBoard) {
        this.board.forEach((row) => {
            row.forEach((unit) => {
                if (unit) this.scene.remove(unit.mesh);
            });
        });

        this.board = newBoard;

        this.board.forEach((row) => {
            row.forEach((unit) => {
                if (unit) this.drawUnit(unit, true);
            });
        });
    }

    static set _allyQueue(newQueue) {
        this.allyQueue.forEach((unit, i) => {
            if (unit) this.scene.remove(unit.mesh);
        });

        this.allyQueue = newQueue;

        this.allyQueue.forEach((unit, i) => {
            if (unit) this.drawUnit(unit, false);
        });
    }

    static drawUnit(unit, onBoard) {
        const coords = onBoard
            ? getBoardCoords(unit.x, unit.y)
            : getQueueCoords(unit.x, unit.owner === Player.player.id);
        unit.mesh.position.set(
            coords[0],
            coords[1] + BOX_HEIGHT / 2 + 5,
            coords[2]
        );
        this.updateUnitMesh(unit);
        this.scene.add(unit.mesh);
    }

    static createUnitMesh(unit) {
        //body
        unit.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshLambertMaterial({ color: 0x000000 })
        );
        unit.mesh.name = "unit";

        // health bar
        const healthBarBackgroundMesh = new THREE.Mesh(
            new THREE.BoxGeometry(30, 8, 1),
            new THREE.MeshLambertMaterial({ color: 0x00000 })
        );
        healthBarBackgroundMesh.name = "healthBarBackground";
        healthBarBackgroundMesh.position.set(0, 30, 0);
        unit.mesh.add(healthBarBackgroundMesh);

        const damagedHealthMesh = new THREE.Mesh(
            new THREE.BoxGeometry(30, 8, 1),
            new THREE.MeshLambertMaterial({ color: 0xcc0000 })
        );
        damagedHealthMesh.name = "damagedHealth";
        damagedHealthMesh.position.set(0, 30, 0);
        unit.mesh.add(damagedHealthMesh);

        const healthBarMesh = new THREE.Mesh(
            new THREE.BoxGeometry(30, 8, 1),
            new THREE.MeshLambertMaterial({ color: 0x00cc00 })
        );
        healthBarMesh.name = "healthBar";
        healthBarMesh.position.set(0, 30, 0);
        unit.mesh.add(healthBarMesh);

        // items
        const itemMesh = new THREE.Mesh(
            new THREE.BoxGeometry(9, 9, 1),
            new THREE.MeshLambertMaterial({ color: 0x000000 })
        );
        itemMesh.material.visible = false;
        itemMesh.name = "item";
        const itemMeshes = [];
        for (let i = 0; i < 3; ++i) {
            const item = itemMesh.clone();
            item.position.set(i * 10 - 10, 20, 0);
            itemMeshes.push(item);
            unit.mesh.add(item);
        }
    }

    static updateUnitMesh(unit) {
        const healthBarMesh = unit.mesh.getObjectByName("healthBar");
        healthBarMesh.scale.x = unit.hp / unit.maxHp;
        healthBarMesh.position.x = (1 - unit.hp / unit.maxHp) * 15;

        const damagedHealthMesh = unit.mesh.getObjectByName("damagedHealth");

        function animateHealthDamage() {
            if (damagedHealthMesh.scale.x > healthBarMesh.scale.x) {
                damagedHealthMesh.scale.x -= 0.01;
                damagedHealthMesh.position.x =
                    (1 - damagedHealthMesh.scale.x) * 15;
                requestAnimationFrame(animateHealthDamage);
            } else {
                damagedHealthMesh.scale.x = healthBarMesh.scale.x;
                damagedHealthMesh.position.x =
                    (1 - damagedHealthMesh.scale.x) * 15;
            }
        }

        animateHealthDamage();
    }
}

function getBoardCoords(x, y) {
    switch (Game.state) {
        case GAME_STATES.ARRANGE:
            return [...COORDINATES.BOARD[y + 3][x]];
        case GAME_STATES.FINISH:
            return [...COORDINATES.BOARD[y + 3][x]];
        case GAME_STATES.BATTLE:
            return Battle.reversed
                ? [...COORDINATES.BOARD[5 - y][4 - x]]
                : [...COORDINATES.BOARD[y][x]];
        case GAME_STATES.READY:
            return Battle.reversed
                ? [...COORDINATES.BOARD[5 - y][4 - x]]
                : [...COORDINATES.BOARD[y][x]];
        default:
            console.log("getBoardCoords: invalid state");
            return [0, 0, 0];
    }
}

function getQueueCoords(x, isAlly) {
    if (isAlly) return [...COORDINATES.ALLY_QUEUE[x]];
    return [...COORDINATES.ENEMY_QUEUE[x]];
}

function onResize() {
    Painter.camera.aspect = window.innerWidth / window.innerHeight;
    Painter.camera.updateProjectionMatrix();
    Painter.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(event) {
    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children,
        false
    );
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.name === "unit") {
            Painter.isDragging = true;
            Painter.draggingObject = object;
        }
    }
}

function onPointerMove(event) {
    // 보이지 않는 보드 위 판을 만들어서 거기에 raycast된 좌표로 이동
    if (!Painter.isDragging) return;

    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children,
        false
    );
    console.log(intersects);
    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "floor") {
            Painter.draggingObject.position.set(
                intersects[i].point.x,
                5,
                intersects[i].point.z
            );
            break;
        }
    }
}

function onPointerUp(event) {
    if (!Painter.isDragging) return;

    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children,
        false
    );
    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "plate") {
            Painter.draggingObject.position.set(
                object.position.x,
                5,
                object.position.z
            );
            break;
        }
    }

    Painter.isDragging = false;
}
