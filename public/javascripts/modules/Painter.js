import * as THREE from "three";
import {
    BOX_DEPTH,
    BOX_HEIGHT,
    BOX_WIDTH,
    COORDINATES,
    GAME_STATES,
    PLATE_HEIGHT,
    PLATE_RADIUS,
} from "./constants.js";
import Game from "./Game.js";
import Battle from "./Battle.js";
import Player from "./Player.js";

export default class Painter {
    static board = [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
    ];
    static allyQueue = [null, null, null, null, null, null, null];
    static enemyQueue = [null, null, null, null, null, null, null];

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
        document.body.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
        this.animate();

        window.onresize = () => {
            Painter.camera.aspect = window.innerWidth / window.innerHeight;
            Painter.camera.updateProjectionMatrix();
            Painter.renderer.setSize(window.innerWidth, window.innerHeight);
        };
    }

    static animate() {
        requestAnimationFrame(Painter.animate);
        Painter.renderer.render(Painter.scene, Painter.camera);
    }

    static drawPlates() {
        let plateGeometry = new THREE.CylinderGeometry(
            PLATE_RADIUS,
            PLATE_RADIUS,
            PLATE_HEIGHT,
            6
        );
        let material = new THREE.MeshLambertMaterial({ color: 0x914461 });

        COORDINATES.BOARD.forEach((row) => {
            row.forEach((coord) => {
                const plate = new THREE.Mesh(plateGeometry, material);
                plate.translateX(coord[0]);
                plate.translateY(coord[1]);
                plate.translateZ(coord[2]);
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
        // TODO: old mesh가 안지워짐. object 관리 필요
        this.board.forEach((row, i) => {
            row.forEach((unit, j) => {
                if (unit) this.scene.remove(unit.mesh); // mesh도 복사되서 이 mesh가 그 mesh가 아니다?
            });
        });

        this.board = newBoard;

        this.board.forEach((row, i) => {
            row.forEach((unit, j) => {
                if (unit) this.drawUnitOnBoard(unit);
            });
        });
    }

    static drawUnitOnBoard(unit) {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const cube = new THREE.Mesh(geometry, material);
        const coords = getBoardCoords(unit.x, unit.y);
        cube.translateX(coords[0]);
        cube.translateY(coords[1] + BOX_HEIGHT / 2 + 5);
        cube.translateZ(coords[2]);
        this.scene.add(cube);
        unit.mesh = cube;
    }

    static set _allyQueue(newQueue) {
        this.allyQueue.forEach((unit, i) => {
            if (unit) this.scene.remove(unit.mesh);
        });

        this.allyQueue = newQueue;

        this.allyQueue.forEach((unit, i) => {
            if (unit) this.drawUnitOnQueue(unit);
        });
    }

    static drawUnitOnQueue(unit) {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const cube = new THREE.Mesh(geometry, material);
        const coords = getQueueCoords(unit.x, unit.owner === Player.player.id);
        cube.translateX(coords[0]);
        cube.translateY(coords[1] + BOX_HEIGHT / 2 + 5);
        cube.translateZ(coords[2]);
        this.scene.add(cube);
        unit.mesh = cube;
    }
}

function getBoardCoords(x, y) {
    switch (Game.state) {
        case GAME_STATES.ARRANGE:
            if (y === 3) return [...COORDINATES.ALLY_QUEUE[x]];
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
            return [0, 0, 0];
    }
}

function getQueueCoords(x, isAlly) {
    if (isAlly) return [...COORDINATES.ALLY_QUEUE[x]];
    return [...COORDINATES.ENEMY_QUEUE[x]];
}
