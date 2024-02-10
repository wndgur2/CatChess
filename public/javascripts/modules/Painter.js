import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import THREE_CONSTS from "./constants/THREE_CONSTS.js";
import Player from "./Player.js";
import Socket from "./Socket.js";
import UI from "./UI.js";
import { objectPool } from "./effects/objectPool.js";
import blood from "./effects/blood.js";
import { getBoardCoords } from "./utils.js";

export default class Painter {
    static board = new Array(6).fill(null).map(() => new Array(5).fill(null));
    static enemyQueue = new Array(7).fill(null);
    static allyQueue = new Array(7).fill(null);
    static draggingObject = null;
    static isDragging = false;
    static textures = {};
    static running = false;

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
        this.camera.position.set(
            0,
            THREE_CONSTS.PLATE_RADIUS * 9,
            -(THREE_CONSTS.PLATE_RADIUS * 10)
        );
        this.camera.lookAt(0, 0, -THREE_CONSTS.PLATE_RADIUS * 2.8);
        this.scene.add(this.camera);

        // light
        const light = new THREE.HemisphereLight(0xdddddd, 0x000000, 1);
        light.position.set(0, THREE_CONSTS.PLATE_RADIUS * 5, 0);
        this.scene.add(light);

        // pointlight
        const pointLight = new THREE.PointLight(
            0xeeeeee,
            25 * Math.pow(THREE_CONSTS.PLATE_RADIUS, 1.5),
            0,
            1.5
        );
        pointLight.position.set(0, THREE_CONSTS.PLATE_RADIUS * 4, 0);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = "scene";
        this.renderer.setClearColor(0xeeeeee, 0.5);
        document.getElementById("game").appendChild(this.renderer.domElement);

        // passes
        const renderScene = new RenderPass(this.scene, this.camera);

        // composer
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

        // effect
        this.hitObjectPool = new objectPool(blood, 100);

        // textures
        this.textureLodaer = new THREE.TextureLoader();
        this.textures.background = this.textureLodaer.load(
            "/images/grounds/background.jpg",
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(
                    THREE_CONSTS.PLATE_RADIUS * 5,
                    THREE_CONSTS.PLATE_RADIUS * 5
                );
            }
        );
        this.textures.board = this.textureLodaer.load(
            "/images/grounds/board.jpg"
        );
        this.textures.queue = this.textureLodaer.load(
            "/images/grounds/queue.jpg"
        );

        // board & queue
        this.drawPlates();
    }

    static startRendering() {
        if (!this.running) {
            this.animate();
            this.running = true;
        }
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
            THREE_CONSTS.PLATE_RADIUS * 50,
            THREE_CONSTS.PLATE_RADIUS * 50
        );
        const backgroundMaterial = new THREE.MeshLambertMaterial({
            map: this.textures.background,
            side: THREE.DoubleSide,
        });
        const background = new THREE.Mesh(
            backgroundGeometry,
            backgroundMaterial
        );
        background.rotateX(Math.PI / 2);
        background.position.set(0, -THREE_CONSTS.PLATE_RADIUS / 10, 0);
        background.name = "background";
        this.scene.add(background);

        // floor
        const floorGeometry = new THREE.PlaneGeometry(
            THREE_CONSTS.PLATE_RADIUS * 50,
            THREE_CONSTS.PLATE_RADIUS * 50
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
            THREE_CONSTS.PLATE_RADIUS,
            THREE_CONSTS.PLATE_RADIUS,
            THREE_CONSTS.PLATE_HEIGHT,
            6
        );
        let material = new THREE.MeshLambertMaterial({
            map: this.textures.board,
        });

        THREE_CONSTS.COORDINATES.BOARD.forEach((row, i) => {
            row.forEach((coord, j) => {
                const plate = new THREE.Mesh(plateGeometry, material);
                plate.position.set(coord[0], coord[1], coord[2]);
                plate.boardCoords = {
                    y: i,
                    x: j,
                };
                if (i >= 3) plate.name = "allyPlate";
                else plate.name = "enemyPlate";
                this.scene.add(plate);
            });
        });

        // queue
        const boxGeometry = new THREE.BoxGeometry(
            THREE_CONSTS.BOX_WIDTH,
            THREE_CONSTS.BOX_HEIGHT,
            THREE_CONSTS.BOX_DEPTH
        );

        // 1 x 7 ally queue
        material = new THREE.MeshLambertMaterial({
            map: this.textures.queue,
        });

        THREE_CONSTS.COORDINATES.ALLY_QUEUE.forEach((coord, i) => {
            const cube = new THREE.Mesh(boxGeometry, material);
            cube.translateX(coord[0]);
            cube.translateY(coord[1]);
            cube.translateZ(coord[2]);
            cube.name = "allyPlate";
            cube.boardCoords = {
                y: 6,
                x: i,
            };
            this.scene.add(cube);
        });

        // 1 x 7 enemy queue
        material = new THREE.MeshLambertMaterial({
            map: this.textures.queue,
        });
        THREE_CONSTS.COORDINATES.ENEMY_QUEUE.forEach((coord, i) => {
            const cube = new THREE.Mesh(boxGeometry, material);
            cube.translateX(coord[0]);
            cube.translateY(coord[1]);
            cube.translateZ(coord[2]);
            cube.name = "enemyPlate";
            this.scene.add(cube);
        });
    }

    static set _board(newBoard) {
        cancelDragging();
        this.board.forEach((row) => {
            row.forEach((unit) => {
                if (unit) {
                    this.scene.remove(unit.mesh);
                }
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
        cancelDragging();
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
            coords[1] +
                (THREE_CONSTS.CAT_HEIGHT + THREE_CONSTS.PLATE_HEIGHT) / 2,
            coords[2]
        );
        this.scene.add(unit.mesh);
    }

    static createUnitMesh(unit) {
        //body
        if (!this.textures[unit.id]) {
            this.textures[unit.id] = this.textureLodaer.load(
                `/images/units/${unit.id}.jpg`
            );
        }
        unit.mesh = new THREE.Group();
        unit.mesh.name = "unitG";
        let bodyMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                THREE_CONSTS.PLATE_RADIUS / 1.5,
                THREE_CONSTS.CAT_HEIGHT,
                THREE_CONSTS.PLATE_RADIUS / 1.5
            ),
            new THREE.MeshStandardMaterial({
                map: this.textures[unit.id],
            })
        );
        bodyMesh.name = "unit";
        bodyMesh.unit = unit;
        unit.mesh.add(bodyMesh);

        // health bar
        const healthBarBackgroundMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                THREE_CONSTS.HEALTHBAR_WIDTH,
                THREE_CONSTS.HEALTHBAR_HEIGHT,
                THREE_CONSTS.HEALTHBAR_HEIGHT / 10
            ),
            new THREE.MeshBasicMaterial({ color: 0x00000 })
        );
        healthBarBackgroundMesh.name = "healthBarBackground";
        healthBarBackgroundMesh.position.set(
            0,
            THREE_CONSTS.CAT_HEIGHT + THREE_CONSTS.HEALTHBAR_HEIGHT,
            0
        );
        unit.mesh.add(healthBarBackgroundMesh);

        const damagedHealthMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                THREE_CONSTS.HEALTHBAR_WIDTH,
                THREE_CONSTS.HEALTHBAR_HEIGHT,
                THREE_CONSTS.HEALTHBAR_HEIGHT / 10
            ),
            new THREE.MeshBasicMaterial({ color: 0xcc0000 })
        );
        damagedHealthMesh.name = "damagedHealth";
        damagedHealthMesh.position.set(
            0,
            THREE_CONSTS.CAT_HEIGHT + THREE_CONSTS.HEALTHBAR_HEIGHT,
            0
        );
        unit.mesh.add(damagedHealthMesh);

        const healthBarMesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                THREE_CONSTS.HEALTHBAR_WIDTH,
                THREE_CONSTS.HEALTHBAR_HEIGHT,
                THREE_CONSTS.HEALTHBAR_HEIGHT / 10
            ),
            new THREE.MeshBasicMaterial({ color: 0x00aa00 })
        );
        healthBarMesh.name = "healthBar";
        healthBarMesh.position.set(
            0,
            THREE_CONSTS.CAT_HEIGHT + THREE_CONSTS.HEALTHBAR_HEIGHT,
            0
        );
        unit.mesh.add(healthBarMesh);

        // items
        this.createItemMesh(unit);
    }

    static hitEffect(attacker, target, damage) {
        this.scene.add(
            this.hitObjectPool.GetObject(
                target.mesh.position,
                attacker.mesh.position
            ).object
        );
    }

    static createItemMesh(unit) {
        // 이미 갖고있던 아이템도 중첩되서 만들고 있음
        unit.items.forEach((item, i) => {
            const itemMesh = new THREE.Mesh(
                new THREE.BoxGeometry(
                    THREE_CONSTS.ITEM_WIDTH,
                    THREE_CONSTS.ITEM_WIDTH,
                    THREE_CONSTS.HEALTHBAR_HEIGHT / 10
                ),
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(
                        `/images/items/${item.id}.jpg`
                    ),
                })
            );
            itemMesh.name = "item";
            itemMesh.position.set(
                (1 - i) * (THREE_CONSTS.ITEM_WIDTH + THREE_CONSTS.ITEM_GAP),
                THREE_CONSTS.CAT_HEIGHT +
                    THREE_CONSTS.HEALTHBAR_HEIGHT -
                    THREE_CONSTS.ITEM_WIDTH,
                0
            );
            itemMesh.item = item;
            unit.mesh.add(itemMesh);
        });
    }

    static resetMeshes() {
        this.scene.children.forEach((child) => {
            if (child.name === "unitG") this.scene.remove(child);
        });
    }

    static sellUnitOnKeypress() {
        Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
        const intersects = Painter.raycaster.intersectObjects(
            Painter.scene.children
        );
        intersects.forEach((intersect) => {
            const object = intersect.object;
            if (object.name === "unit") {
                if (object.unit.owner !== Player.player.id) return;
                if (object.unit.inBattle) return;
                Socket.sendMsg("reqSellCat", {
                    uid: object.unit.uid,
                });
            }
        });
    }
}

function getQueueCoords(x, isAlly) {
    if (isAlly) return [...THREE_CONSTS.COORDINATES.ALLY_QUEUE[x]];
    return [...THREE_CONSTS.COORDINATES.ENEMY_QUEUE[x]];
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
        Painter.scene.children
    );
    intersects.forEach((intersect) => {
        const object = intersect.object;
        if (object.name === "unit") {
            if (object.unit.inBattle) return;
            Painter.isDragging = true;
            Painter.draggingObject = object;
        }
    });
    UI.hideUnitInfo();
}

function onPointerMove(event) {
    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (!Painter.isDragging) {
        return;
    }
    if (UI.isDragging) {
        UI.isDragging = false;
        return;
    }

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children
    );
    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "floor") {
            Painter.draggingObject.parent.position.set(
                intersects[i].point.x,
                THREE_CONSTS.CAT_HEIGHT / 1.5,
                intersects[i].point.z
            );
            break;
        }
    }
}

function onPointerUp(event) {
    Painter.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (
        // click 판정
        Painter.mouse.x <= Painter.dragStart.x + 0.1 &&
        Painter.mouse.x >= Painter.dragStart.x - 0.1 &&
        Painter.mouse.y <= Painter.dragStart.y + 0.1 &&
        Painter.mouse.y >= Painter.dragStart.y - 0.1
    ) {
        onPointerClick(event);
    }

    if (!Painter.isDragging) return;

    Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
    const intersects = Painter.raycaster.intersectObjects(
        Painter.scene.children,
        false
    );
    for (let i = 0; i < intersects.length; ++i) {
        const object = intersects[i].object;
        if (object.name === "allyPlate") {
            Socket.sendMsg("reqPutCat", {
                uid: Painter.draggingObject.unit.uid,
                to: {
                    x: object.boardCoords.x,
                    y: object.boardCoords.y - 3,
                },
            });
            return;
        }
    }
    cancelDragging();
}

function cancelDragging() {
    if (!Painter.isDragging) return;
    Painter.isDragging = false;
    Painter.drawUnit(
        Painter.draggingObject.unit,
        Painter.draggingObject.unit.y !== 3
    );
    Painter.draggingObject = null;
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
            console.log(object);
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
            if (object.unit.owner !== Player.player.id) return;
            Socket.sendMsg("reqGiveItem", {
                item: {
                    x: parseInt(UI.draggingId.split("-")[2]),
                    y: parseInt(UI.draggingId.split("-")[1]),
                },
                uid: object.unit.uid,
            });
            break;
        }
    }

    UI.isDragging = false;
}
