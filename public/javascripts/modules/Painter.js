import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import {
    BOX_DEPTH,
    BOX_HEIGHT,
    BOX_WIDTH,
    COORDINATES,
    PLATE_HEIGHT,
    PLATE_RADIUS,
    CAT_HEIGHT,
    HEALTHBAR_WIDTH,
    HEALTHBAR_HEIGHT,
    ITEM_WIDTH,
    ITEM_GAP,
} from "./constants/THREE_CONSTS.js";
import Player from "./Player.js";
import Socket from "./Socket.js";
import UI from "./UI.js";
import { objectPool } from "./effect/objectPool.js";
import blood from "./effect/blood.js";
import { getBoardCoords } from "./untils.js";

export default class Painter {
    static board = new Array(6).fill(null).map(() => new Array(5).fill(null));
    static enemyQueue = new Array(7).fill(null);
    static allyQueue = new Array(7).fill(null);
    static draggingObject = null;
    static isDragging = false;

    static initScene() {
        this.scene = new THREE.Scene();

        this.clock = new THREE.Clock();

        // camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, PLATE_RADIUS * 9, -(PLATE_RADIUS * 10));
        this.camera.lookAt(0, 0, -PLATE_RADIUS * 2.8);
        this.scene.add(this.camera);

        // light
        const light = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
        light.position.set(0, PLATE_RADIUS * 5, 0);
        this.scene.add(light);

        // pointlight
        const pointLight = new THREE.PointLight(
            0xffffff,
            120 * Math.pow(PLATE_RADIUS, 2)
        );
        pointLight.position.set(0, PLATE_RADIUS * 4, 0);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        // board & queue
        this.drawPlates();

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = "scene";
        this.renderer.setClearColor(0xeeeeee, 0.5);
        document.getElementById("game").appendChild(this.renderer.domElement);

        const renderScene = new RenderPass(this.scene, this.camera);

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);

        // interaction
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        window.addEventListener("resize", onResize);
        window.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        this.renderer.domElement.addEventListener("dragover", onDragOver);
        this.renderer.domElement.addEventListener("drop", onDrop);

        //effect
        this.hitObjectPool = new objectPool(blood, 100);
    }

    static startRendering() {
        this.animate();
    }

    static animate() {
        requestAnimationFrame(Painter.animate);
        const dt = Painter.clock.getDelta();
        Painter.hitObjectPool.Update(dt);
        Painter.composer.render();
    }

    static drawPlates() {
        // background
        const backgroundGeometry = new THREE.PlaneGeometry(
            PLATE_RADIUS * 50,
            PLATE_RADIUS * 50
        );
        const backgroundMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load(
                "/images/grounds/background.jpg",
                (texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(PLATE_RADIUS * 5, PLATE_RADIUS * 5);
                }
            ),
            side: THREE.DoubleSide,
        });
        const background = new THREE.Mesh(
            backgroundGeometry,
            backgroundMaterial
        );
        background.rotateX(Math.PI / 2);
        background.position.set(0, -PLATE_RADIUS / 10, 0);
        background.name = "background";
        this.scene.add(background);

        // floor
        const floorGeometry = new THREE.PlaneGeometry(
            PLATE_RADIUS * 50,
            PLATE_RADIUS * 50
        );
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
        let material = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load("/images/grounds/board.jpg"),
        });

        COORDINATES.BOARD.forEach((row, i) => {
            row.forEach((coord, j) => {
                const plate = new THREE.Mesh(plateGeometry, material);
                plate.position.set(coord[0], coord[1], coord[2]);
                plate.boardCoords = {
                    y: i,
                    x: j,
                };
                if (i >= 3) plate.name = "plate";
                else plate.name = "enemy";
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
        material = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load("/images/grounds/queue.jpg"),
        });

        COORDINATES.ALLY_QUEUE.forEach((coord, i) => {
            const cube = new THREE.Mesh(boxGeometry, material);
            cube.translateX(coord[0]);
            cube.translateY(coord[1]);
            cube.translateZ(coord[2]);
            cube.name = "plate";
            cube.boardCoords = {
                y: 6,
                x: i,
            };
            this.scene.add(cube);
        });

        // 1 x 7 enemy queue
        material = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load("/images/grounds/queue.jpg"),
        });
        COORDINATES.ENEMY_QUEUE.forEach((coord, i) => {
            const cube = new THREE.Mesh(boxGeometry, material);
            cube.translateX(coord[0]);
            cube.translateY(coord[1]);
            cube.translateZ(coord[2]);
            cube.name = "enemy";
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
            coords[1] + (CAT_HEIGHT + PLATE_HEIGHT) / 2,
            coords[2]
        );
        this.scene.add(unit.mesh);
    }

    static createUnitMesh(unit) {
        //body
        unit.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                PLATE_RADIUS / 2,
                PLATE_RADIUS / 2,
                PLATE_RADIUS / 2
            ),
            new THREE.MeshLambertMaterial({ color: 0x007777 })
        );
        unit.mesh.name = "unit";
        unit.mesh.unit = unit;

        // health bar
        const healthBarBackgroundMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                HEALTHBAR_WIDTH,
                HEALTHBAR_HEIGHT,
                HEALTHBAR_HEIGHT / 10
            ),
            new THREE.MeshBasicMaterial({ color: 0x00000 })
        );
        healthBarBackgroundMesh.name = "healthBarBackground";
        healthBarBackgroundMesh.position.set(
            0,
            (CAT_HEIGHT + HEALTHBAR_HEIGHT) * 1.5,
            0
        );
        unit.mesh.add(healthBarBackgroundMesh);

        const damagedHealthMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                HEALTHBAR_WIDTH,
                HEALTHBAR_HEIGHT,
                HEALTHBAR_HEIGHT / 10
            ),
            new THREE.MeshBasicMaterial({ color: 0xcc0000 })
        );
        damagedHealthMesh.name = "damagedHealth";
        damagedHealthMesh.position.set(
            0,
            (CAT_HEIGHT + HEALTHBAR_HEIGHT) * 1.5,
            0
        );
        unit.mesh.add(damagedHealthMesh);

        const healthBarMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                HEALTHBAR_WIDTH,
                HEALTHBAR_HEIGHT,
                HEALTHBAR_HEIGHT / 10
            ),
            new THREE.MeshBasicMaterial({ color: 0x00aa00 })
        );
        healthBarMesh.name = "healthBar";
        healthBarMesh.position.set(0, (CAT_HEIGHT + HEALTHBAR_HEIGHT) * 1.5, 0);
        unit.mesh.add(healthBarMesh);

        // items
        unit.items.forEach((item, i) => {
            const itemMesh = new THREE.Mesh(
                new THREE.BoxGeometry(
                    ITEM_WIDTH,
                    ITEM_WIDTH,
                    HEALTHBAR_HEIGHT / 10
                ),
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(
                        `/images/items/${item.id}.jpg`
                    ),
                })
            );
            itemMesh.name = "item";
            itemMesh.position.set(
                (1 - i) * (ITEM_WIDTH + ITEM_GAP),
                CAT_HEIGHT + HEALTHBAR_HEIGHT,
                0
            );
            itemMesh.item = item;
            unit.mesh.add(itemMesh);
        });
    }

    static hitEffect(attacker, target, damage) {
        this.scene.add(
            this.hitObjectPool.GetObject(
                target.mesh.position,
                attacker.mesh.position
            ).object
        );
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

    Painter.dragStart = Painter.mouse.clone();

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children,
        false
    );
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.name === "unit") {
            if (!object.unit.draggable) return;
            Painter.isDragging = true;
            Painter.draggingObject = object;
        }
    }
    UI.hideUnitInfo();
}

function onPointerMove(event) {
    // if (!Painter.isDragging) return checkMouseHover(event);
    if (!Painter.isDragging) return;
    if (UI.isDragging) {
        UI.isDragging = false;
        return;
    }

    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children,
        false
    );
    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "floor") {
            Painter.draggingObject.position.set(
                intersects[i].point.x,
                CAT_HEIGHT,
                intersects[i].point.z
            );
            break;
        }
    }
}

function checkMouseHover(event) {
    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children
    );
    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "item") {
            UI.popUp(object.item.info(), event);
            return;
        }
    }
    UI.popDown();
}

function onPointerUp(event) {
    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (
        // click 판정
        Painter.mouse.x <= Painter.dragStart.x + PLATE_RADIUS / 50 &&
        Painter.mouse.x >= Painter.dragStart.x - PLATE_RADIUS / 50 &&
        Painter.mouse.y <= Painter.dragStart.y + PLATE_RADIUS / 50 &&
        Painter.mouse.y >= Painter.dragStart.y - PLATE_RADIUS / 50
    ) {
        onPointerClick(event);
    }

    if (!Painter.isDragging) return;
    Painter.isDragging = false;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children,
        false
    );
    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "plate") {
            Socket.sendMsg("reqPutCat", {
                from: {
                    x: Painter.draggingObject.unit.x,
                    y: Painter.draggingObject.unit.y,
                },
                to: {
                    x: object.boardCoords.x,
                    y: object.boardCoords.y - 3,
                },
            });
            return;
        }
    }
    Painter.drawUnit(
        Painter.draggingObject.unit,
        Painter.draggingObject.unit.y !== 3
    );
}

function onPointerClick(event) {
    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children
    );
    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "unit") {
            UI.showUnitInfo(object.unit);
            return;
        }
    }
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    if (!UI.isDragging) return;

    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children
    );

    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "unit") {
            Socket.sendMsg("reqGiveItem", {
                item: {
                    x: parseInt(UI.draggingId.split("-")[2]),
                    y: parseInt(UI.draggingId.split("-")[1]),
                },
                to: {
                    x: object.unit.x,
                    y: object.unit.y,
                },
            });
            break;
        }
    }

    UI.isDragging = false;
}
