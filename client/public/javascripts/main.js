var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// client/javascripts/modules/3D/Painter.js
import * as THREE5 from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";
import { GLTFLoader as GLTFLoader2 } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// client/javascripts/modules/Unit.js
import * as THREE from "three";

// client/javascripts/modules/Item.js
var Item = class {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.desc = data.desc;
    this.img = data.img;
    this.imageEl = document.createElement("img");
    this.imageEl.src = `/images/items/${this.id}.png`;
    this.imageEl.className = "itemImg";
    this.ad = data.ad;
    this.hp = data.hp;
    this.armor = data.armor;
    this.range = data.range;
    this.speed = data.speed;
  }
  getStat() {
    let type = this.ad ? "\uACF5\uACA9\uB825" : this.hp ? "\uCCB4\uB825" : this.armor ? "\uBC29\uC5B4\uB825" : this.range ? "\uC0AC\uAC70\uB9AC" : this.speed ? "\uBBFC\uCCA9" : "";
    let stat = this.ad || this.hp || this.armor || this.range || this.speed;
    return `${type} +${stat}`;
  }
  info() {
    return `<div style="text-align:center;">
        <div>${this.img}</div>
        <div>${this.name}</div>
        <div>${this.getStat()}</div>
        </div>`;
  }
};

// client/javascripts/modules/constants/consts.js
var GAME_STATES = {
  ARRANGE: "arrange",
  BATTLE: "battle",
  READY: "ready",
  FINISH: "finish"
};
var SYNERGIES = {
  Poeir: {
    desc: {
      3: {
        en: "Poeir units gain 25% Attack Damage.",
        ko: "\uD3EC\uC5D0\uB974 \uC720\uB2DB\uC758 \uACF5\uACA9\uB825\uC774 25% \uC99D\uAC00\uD569\uB2C8\uB2E4."
      },
      6: {
        en: "Poeir units gain 50% Attack Damage.",
        ko: "\uD3EC\uC5D0\uB974 \uC720\uB2DB\uC758 \uACF5\uACA9\uB825\uC774 50% \uC99D\uAC00\uD569\uB2C8\uB2E4."
      }
    }
  },
  Therme: {
    desc: {
      2: {
        en: "Therme units gain 10% Attack Speed.",
        ko: "\uD14C\uB974\uBA54 \uC720\uB2DB\uC758 \uACF5\uACA9\uC18D\uB3C4\uAC00 10% \uC99D\uAC00\uD569\uB2C8\uB2E4."
      },
      4: {
        en: "Therme units gain 25% Attack Speed.",
        ko: "\uD14C\uB974\uBA54 \uC720\uB2DB\uC758 \uACF5\uACA9\uC18D\uB3C4\uAC00 25% \uC99D\uAC00\uD569\uB2C8\uB2E4."
      },
      6: {
        en: "Therme units gain 50% Attack Speed.",
        ko: "\uD14C\uB974\uBA54 \uC720\uB2DB\uC758 \uACF5\uACA9\uC18D\uB3C4\uAC00 50% \uC99D\uAC00\uD569\uB2C8\uB2E4."
      }
    }
  },
  Nature: {
    desc: {
      2: {
        en: "Nature units gain 10% Armor.",
        ko: "\uB124\uC774\uCC98 \uC720\uB2DB\uC758 \uBC29\uC5B4\uB825\uC774 10% \uC99D\uAC00\uD569\uB2C8\uB2E4."
      },
      4: {
        en: "Nature units gain 25% Armor.",
        ko: "\uB124\uC774\uCC98 \uC720\uB2DB\uC758 \uBC29\uC5B4\uB825\uC774 25% \uC99D\uAC00\uD569\uB2C8\uB2E4."
      },
      6: {
        en: "Nature units gain 50% Armor.",
        ko: "\uB124\uC774\uCC98 \uC720\uB2DB\uC758 \uBC29\uC5B4\uB825\uC774 50% \uC99D\uAC00\uD569\uB2C8\uB2E4."
      }
    }
  }
};
var COST_COLORS = {
  1: "#cccccc",
  2: "#33bb11",
  3: "#3366ee",
  4: "#af11af",
  5: "#cccc21"
};

// client/javascripts/modules/constants/threeConsts.js
var PLATE_RADIUS = 2;
var PLATE_WIDTH = PLATE_RADIUS * Math.sqrt(3);
var PLATE_DEPTH = 3 / 2 * PLATE_RADIUS;
var PLATE_HEIGHT = PLATE_RADIUS / 4;
var PLATE_GAP = PLATE_RADIUS / 18;
var BOX_WIDTH = PLATE_RADIUS * 1.5;
var BOX_DEPTH = PLATE_RADIUS * 1.5;
var BOX_HEIGHT = PLATE_HEIGHT;
var BOX_GAP = BOX_WIDTH / 18;
var COORDINATES = {
  BOARD: [],
  ALLY_QUEUE: [],
  ENEMY_QUEUE: []
};
for (let i = 5; i >= 0; i--) {
  COORDINATES.BOARD.push([]);
  for (let j = 4; j >= 0; j--) {
    const coord = [0, 0, 0];
    coord[0] = j * (PLATE_WIDTH + PLATE_GAP) - 4.5 * (PLATE_WIDTH + PLATE_GAP) / 2;
    coord[1] = -PLATE_HEIGHT / 2;
    coord[2] = i * (PLATE_DEPTH + PLATE_GAP) - 5 * (PLATE_DEPTH + PLATE_GAP) / 2;
    if (i % 2 == 0) coord[0] += (PLATE_WIDTH + PLATE_GAP) / 2;
    COORDINATES.BOARD[5 - i].push(coord);
  }
}
for (let i = 6; i >= 0; i--) {
  const coord = [0, 0, 0];
  coord[0] = i * (BOX_WIDTH + BOX_GAP) - 6 * (BOX_WIDTH + BOX_GAP) / 2;
  coord[1] = -BOX_HEIGHT / 2;
  coord[2] = -1 * ((PLATE_DEPTH + PLATE_GAP) * 3.5 + BOX_DEPTH / 4);
  COORDINATES.ALLY_QUEUE.push(coord);
}
for (let i = 6; i >= 0; i--) {
  const coord = [0, 0, 0];
  coord[0] = i * (BOX_WIDTH + BOX_GAP) - 6 * (BOX_WIDTH + BOX_GAP) / 2;
  coord[1] = -BOX_HEIGHT / 2;
  coord[2] = (PLATE_DEPTH + PLATE_GAP) * 3.5 + BOX_DEPTH / 4;
  COORDINATES.ENEMY_QUEUE.push(coord);
}
var CAT_HEIGHT = PLATE_RADIUS;
var HEALTHBAR_WIDTH = PLATE_RADIUS * 1.5;
var HEALTHBAR_HEIGHT = PLATE_RADIUS / 5;
var HEALTHBAR_DEPTH = PLATE_RADIUS / 30;
var MANABAR_WIDTH = PLATE_RADIUS * 1.5;
var MANABAR_HEIGHT = HEALTHBAR_HEIGHT / 2;
var MANABAR_DEPTH = PLATE_RADIUS / 30;
var STATS_GAP = HEALTHBAR_WIDTH / 60;
var ITEM_WIDTH = HEALTHBAR_WIDTH / 3 - STATS_GAP;
var ITEM_DEPTH = HEALTHBAR_HEIGHT / 10;
var CAT_PARTS = {
  head: {
    width: 0.8,
    height: 0.8,
    depth: 0.9,
    position: { x: 0, y: 0.8, z: 1 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  body: {
    width: 1,
    height: 1,
    depth: 2.2,
    position: { x: 0, y: 0.5, z: -0.2 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  leg1: {
    width: 0.4,
    height: 1.2,
    depth: 0.4,
    position: { x: 0.3, y: 0, z: 0.6 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  leg2: {
    width: 0.4,
    height: 1.2,
    depth: 0.4,
    position: { x: -0.3, y: 0, z: 0.6 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  leg3: {
    width: 0.4,
    height: 1.2,
    depth: 0.4,
    position: { x: 0.3, y: 0, z: -1 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  leg4: {
    width: 0.4,
    height: 1.2,
    depth: 0.4,
    position: { x: -0.3, y: 0, z: -1 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  tail: {
    width: 0.2,
    height: 1,
    depth: 0.2,
    position: { x: 0, y: 0.5, z: -1.5 },
    rotation: { x: Math.PI / 4, y: 0, z: 0 }
  }
};
var THREE_CONSTS = {
  COORDINATES,
  PLATE_RADIUS,
  PLATE_WIDTH,
  PLATE_HEIGHT,
  BOX_WIDTH,
  BOX_DEPTH,
  BOX_HEIGHT,
  CAT_HEIGHT,
  HEALTHBAR_WIDTH,
  HEALTHBAR_HEIGHT,
  HEALTHBAR_DEPTH,
  MANABAR_WIDTH,
  MANABAR_HEIGHT,
  MANABAR_DEPTH,
  ITEM_WIDTH,
  ITEM_DEPTH,
  STATS_GAP
};

// client/javascripts/modules/utils.js
function getBoardCoords(x, z) {
  switch (Game.state) {
    case GAME_STATES.ARRANGE:
      return [...THREE_CONSTS.COORDINATES.BOARD[z + 3][x]];
    case GAME_STATES.FINISH:
      return [...THREE_CONSTS.COORDINATES.BOARD[z + 3][x]];
    case GAME_STATES.BATTLE:
      return Battle_default.reversed ? [...THREE_CONSTS.COORDINATES.BOARD[5 - z][4 - x]] : [...THREE_CONSTS.COORDINATES.BOARD[z][x]];
    case GAME_STATES.READY:
      return Battle_default.reversed ? [...THREE_CONSTS.COORDINATES.BOARD[5 - z][4 - x]] : [...THREE_CONSTS.COORDINATES.BOARD[z][x]];
    default:
      console.log("getBoardCoords: invalid state");
      return [0, 0, 0];
  }
}
function getCookie(key) {
  let cookie = decodeURIComponent(document.cookie);
  let cookieArr = cookie.split("; ");
  let value = "";
  cookieArr.forEach((cookie2) => {
    if (cookie2.includes(key)) value = cookie2.split("=")[1];
  });
  if (!value) return null;
  return value;
}
function getText(text) {
  return text[getCookie("lang") || "en"];
}

// client/javascripts/modules/Synergy.js
var _Synergy = class _Synergy {
  static getSynergy(id) {
    if (_Synergy.instances[id]) return _Synergy.instances[id];
    else return new _Synergy({ id });
  }
  constructor(data) {
    this.id = data.id;
    this.desc = SYNERGIES[this.id].desc;
    _Synergy.instances[this.id] = this;
  }
  describe(amount = 0) {
    let descs = [];
    let active = -1;
    let i = 0;
    for (const [a, d] of Object.entries(this.desc)) {
      if (amount >= parseInt(a)) active = i;
      descs.push(`${a} : ${getText(d)}`);
      ++i;
    }
    let result = "";
    descs.forEach((d, j) => {
      result = result.concat(
        `<span class=${j === active ? "synergyActive" : "synergyInactive"}>${d}</span>`
      );
    });
    return result;
  }
  display(amount = 0) {
    const isActive = amount >= parseInt(Object.keys(this.desc)[0]);
    let synergyEl = document.createElement("div");
    synergyEl.className = "synergy";
    synergyEl.id = this.id;
    synergyEl.style.background = `url(/images/synergies/${this.id}.jpg)`;
    synergyEl.style.backgroundSize = "cover";
    synergyEl.style.backgroundPosition = "center";
    synergyEl.style.border = isActive ? "0.14dvh solid #E1C573" : "0.14dvh solid #807253";
    synergyEl.style.color = isActive ? "#fff" : "#aaa";
    let synergyName = document.createElement("span");
    synergyName.innerHTML = this.id;
    synergyEl.appendChild(synergyName);
    if (amount > 0) {
      let synergyAmount = document.createElement("span");
      synergyAmount.innerHTML = amount;
      synergyEl.appendChild(synergyAmount);
    }
    synergyEl.addEventListener("mouseenter", synergyMouseEnter);
    synergyEl.addEventListener("mouseleave", synergyMouseLeave);
    return synergyEl;
  }
};
__publicField(_Synergy, "instances", {});
var Synergy = _Synergy;
function synergyMouseEnter(event) {
  UI.popUp(
    Synergy.getSynergy(event.target.id).describe(
      Player.player.synergies[event.target.id] ? Player.player.synergies[event.target.id].length : 0
    ),
    event
  );
}
function synergyMouseLeave() {
  UI.popDown();
}

// client/javascripts/modules/Unit.js
var _Unit = class _Unit {
  static async fetchData() {
    await fetch("/data/cats").then((res) => res.json()).then((data) => {
      _Unit.CATS = data;
      return data;
    });
    await fetch("/data/creeps").then((res) => res.json()).then((data) => {
      _Unit.CREEPS = data;
      return data;
    });
  }
  constructor(data) {
    this.name = _Unit.CATS.concat(_Unit.CREEPS).find((unit) => unit.id === data.id).name;
    this.desc = _Unit.CATS.concat(_Unit.CREEPS).find((unit) => unit.id === data.id).desc;
    this.id = data.id;
    this.uid = data.uid;
    this.tier = data.tier;
    this.skill = data.skill;
    this.synergies = data.synergies;
    this.ad = data.ad;
    this.speed = data.speed;
    this.range = data.range;
    this.maxHp = data.maxHp;
    this.hp = data.hp;
    this.maxMp = data.maxMp;
    this.mp = data.mp;
    this.armor = data.armor;
    this.originalCost = data.originalCost;
    this.cost = data.cost;
    this.owner = data.owner;
    this.items = data.items.map((item) => item ? new Item(item) : null);
    this.x = data.x;
    this.y = data.y;
    this.inBattle = false;
    this.focused = false;
    if (!_Unit.imageEls[this.id]) {
      this.imageEl = document.createElement("img");
      this.imageEl.src = `/images/portraits/${this.id}.jpg`;
      this.imageEl.id = "unitImg";
      _Unit.imageEls[this.id] = this.imageEl;
    } else this.imageEl = _Unit.imageEls[this.id];
    this.color = COST_COLORS[this.originalCost];
    if (!_Unit.skillImageEls[this.skill.id]) {
      this.skillImageEl = document.createElement("img");
      this.skillImageEl.id = "unitSkill";
      this.skillImageEl.src = `/images/skills/${this.skill.id}.jpg`;
      _Unit.skillImageEls[this.skill.id] = this.skillImageEl;
    } else this.skillImageEl = _Unit.skillImageEls[this.skill.id];
    this.mesh = null;
    Painter.createUnitMesh(this);
  }
  die() {
    this._hp = 0;
    Painter.scene.remove(this.mesh);
  }
  showInfo() {
    this.focused = true;
    document.getElementById("unitImgWrapper").innerHTML = "";
    document.getElementById("unitImgWrapper").appendChild(this.imageEl);
    document.getElementById("unitName").innerHTML = "\u2605".repeat(this.tier) + this.name;
    document.getElementById("unitName").style.color = this.color;
    let unitSynergiesEl = document.getElementById("unitSynergies");
    unitSynergiesEl.innerHTML = "";
    this.synergies.forEach((synergy) => {
      const s = Synergy.getSynergy(synergy);
      unitSynergiesEl.appendChild(s.display());
    });
    document.getElementById("cost").innerHTML = this.cost;
    document.getElementById("hp").innerHTML = this.hp;
    document.getElementById("maxHp").innerHTML = this.maxHp;
    document.getElementById("mp").innerHTML = this.mp;
    document.getElementById("maxMp").innerHTML = this.maxMp;
    document.getElementById("ad").innerHTML = this.ad;
    document.getElementById("armor").innerHTML = this.armor;
    document.getElementById("range").innerHTML = this.range;
    document.getElementById("speed").innerHTML = this.speed;
    let unitSkillWrapperEl = document.getElementById("unitSkillWrapper");
    unitSkillWrapperEl.innerHTML = "";
    unitSkillWrapperEl.appendChild(this.skillImageEl);
    let itemEls = document.getElementsByClassName("item");
    for (let i = 0; i < itemEls.length; i++) {
      itemEls[i].innerHTML = "";
      if (this.items[i]) itemEls[i].appendChild(this.items[i].imageEl);
    }
  }
  skillInfo() {
    return `<div><span>${this.skill.name}</span><br /><span>${this.skill.desc}</span></div>`;
  }
  set _hp(newHp) {
    this.hp = newHp < 0 ? 0 : newHp;
    if (this.focused) document.getElementById("hp").innerHTML = this.hp;
    const healthBarMesh = this.mesh.getObjectByName("healthBar");
    healthBarMesh.scale.x = this.hp / this.maxHp;
    healthBarMesh.position.x = (1 - this.hp / this.maxHp) * THREE_CONSTS.HEALTHBAR_WIDTH / 2;
    const damagedHealthMesh = this.mesh.getObjectByName("damagedHealthBar");
    function animateHealthDamage() {
      if (damagedHealthMesh.scale.x > healthBarMesh.scale.x) {
        damagedHealthMesh.scale.x -= 0.01;
        damagedHealthMesh.position.x = (1 - damagedHealthMesh.scale.x) * THREE_CONSTS.HEALTHBAR_WIDTH / 2;
        requestAnimationFrame(animateHealthDamage);
      } else {
        damagedHealthMesh.scale.x = healthBarMesh.scale.x;
        damagedHealthMesh.position.x = (1 - damagedHealthMesh.scale.x) * THREE_CONSTS.HEALTHBAR_WIDTH / 2;
      }
    }
    animateHealthDamage();
  }
  set _mp(newMp) {
    if (newMp < 0) newMp = 0;
    if (newMp > this.maxMp) newMp = this.maxMp;
    this.mp = newMp;
    if (this.focused) document.getElementById("mp").innerHTML = this.mp;
    const manaBarMesh = this.mesh.getObjectByName("manaBar");
    manaBarMesh.scale.x = this.mp / this.maxMp;
    manaBarMesh.position.x = (1 - this.mp / this.maxMp) * THREE_CONSTS.MANABAR_WIDTH / 2;
  }
  attack(target) {
    const bodyMesh = this.mesh.getObjectByName("unitBody");
    bodyMesh.lookAt(target.mesh.position);
    const duration = 12;
    let i = 0;
    function animate() {
      if (i < duration / 2) bodyMesh.translateZ(0.2);
      else bodyMesh.translateZ(-0.2);
      if (++i < duration) requestAnimationFrame(animate);
    }
    animate();
  }
  move(nextX, nextY) {
    const beforeCoords = getBoardCoords(this.x, this.y);
    const nextCoords = getBoardCoords(nextX, nextY);
    const nextLocation = new THREE.Vector3(...nextCoords);
    const bodyMesh = this.mesh.getObjectByName("unitBody");
    nextLocation.setY(new THREE.Box3().setFromObject(bodyMesh).getCenter(new THREE.Vector3()).y);
    bodyMesh.lookAt(nextLocation);
    const toMoveCoords = {
      x: nextCoords[0] - beforeCoords[0],
      z: nextCoords[2] - beforeCoords[2]
    };
    const durationToMove = 240 / this.speed;
    let i = 0;
    const animateMove = () => {
      if (++i > durationToMove) return;
      this.mesh.position.x += toMoveCoords.x / durationToMove;
      this.mesh.position.z += toMoveCoords.z / durationToMove;
      requestAnimationFrame(animateMove);
    };
    animateMove();
  }
  cast() {
    Painter.castEffect(this);
  }
};
__publicField(_Unit, "imageEls", {});
__publicField(_Unit, "skillImageEls", {});
var Unit = _Unit;

// client/javascripts/modules/User.js
var User = class _User {
  static isAuthenticated() {
    let token = getCookie("token");
    if (!token) return false;
    return true;
  }
  static init() {
    _User.authenticate();
  }
  static authenticate() {
    if (_User.isAuthenticated()) {
      Socket.id = getCookie("email").split("@")[0];
      document.getElementById("id").innerHTML = Socket.id;
      fetch(`/user/init`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`
        }
      }).then((res) => {
        return res.json();
      }).then((data) => {
        document.cookie = `record=${encodeURIComponent(
          getRecord(data.win, data.loss)
        )}`;
        document.querySelector("#signinBtnWrapper").style.display = "none";
        document.querySelector("#userInfoWrapper").style.display = "flex";
        document.querySelector("#userName").innerHTML = Socket.id;
        document.querySelector("#record").innerHTML = `${getCookie(
          "record"
        )}`;
      });
    } else {
      document.querySelector("#signinBtnWrapper").style.display = "flex";
      document.querySelector("#userInfoWrapper").style.display = "none";
    }
  }
  static signIn() {
    window.location.href = `/auth/google`;
  }
  static signOut() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const key = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (key !== "lang")
        document.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    location.reload(true);
  }
  static saveLog(winOrLose) {
    fetch(`/user/${winOrLose}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`
      }
    });
  }
};
function getRecord(win, loss) {
  let rate = 0;
  if (win + loss > 0) rate = win / (win + loss) * 100;
  return `${win}W ${loss}L (${rate.toFixed(0)}%)`;
}

// client/javascripts/modules/constants/texts.js
var MATCH = {
  en: "Match",
  ko: "\uAC8C\uC784 \uB9E4\uCE6D"
};
var CANCEL_MATCHING = {
  en: "Cancel Matching",
  ko: "\uB9E4\uCE6D \uCDE8\uC18C"
};
var WAITING_FOR_CONNECTION = {
  en: "Waiting for connection...",
  ko: "\uC11C\uBC84\uC640 \uC5F0\uACB0\uC911\uC785\uB2C8\uB2E4..."
};
var NOT_SUPPORTED_DEVICE = {
  en: "Not supported device",
  ko: "\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uAE30\uAE30\uC785\uB2C8\uB2E4."
};
var WIN = {
  en: "win",
  ko: "\uC2B9\uB9AC\uD588\uC2B5\uB2C8\uB2E4."
};
var LOSE = {
  en: "lose",
  ko: "\uD328\uBC30\uD588\uC2B5\uB2C8\uB2E4."
};

// client/javascripts/modules/Socket.js
var _Socket = class _Socket {
  static async init() {
    const url = `ws://${process.env.SERVER_URL}`;
    _Socket.socket = new WebSocket(url);
    _Socket.socket.onopen = function(event) {
      console.log(`web socket connected to ${url}.`);
      if (!_Socket.id) _Socket.sendMsg("reqNewId", null);
      else readyToPlay();
    };
    _Socket.socket.onmessage = function(event) {
      const { type, data } = JSON.parse(event.data);
      switch (type) {
        case "resNewId": {
          if (_Socket.id) return;
          _Socket.id = data;
          document.cookie = `tempId=${encodeURIComponent(data)}`;
          readyToPlay();
          break;
        }
        case "gameMatched": {
          UI.gameStart();
          Game.init(data.players);
          break;
        }
        case "playerData": {
          const p = Player.getPlayerById(data.id);
          if (p) p._hp = data.hp;
        }
        case "timeUpdate": {
          if (data.time) Game._time = data.time;
          break;
        }
        case "stageUpdate": {
          Game._round = data.round;
          Game._stage = data.stage;
          UI.hideUnitInfo();
          break;
        }
        case "stateUpdate": {
          Game._state = data.state;
          if (data.time) Game._time = data.time;
          break;
        }
        case "boardUpdate": {
          Player.getPlayerById(data.player)._board = data.board;
          break;
        }
        case "queueUpdate": {
          Player.getPlayerById(data.player)._queue = data.queue;
          break;
        }
        case "expUpdate": {
          Player.player._exp = data.exp;
          Player.player._maxExp = data.maxExp;
          break;
        }
        case "levelUpdate": {
          Player.getPlayerById(data.player)._level = data.level;
          break;
        }
        case "moneyUpdate": {
          Player.getPlayerById(data.player)._money = data.money;
          break;
        }
        case "shopUpdate": {
          Player.getPlayerById(data.player)._shop = data.shop;
          break;
        }
        case "itemUpdate": {
          Player.getPlayerById(data.player)._items = data.items.map(
            (item) => item ? new Item(item) : null
          );
          break;
        }
        case "hpUpdate": {
          let p = Player.getPlayerById(data.player);
          if (p) p._hp = data.hp;
          break;
        }
        case "battleReady": {
          Battle_default.id = data.battleId;
          Battle_default.board = data.board.map((row) => row.map((cat) => cat ? new Unit(cat) : null));
          Battle_default.ready(data.reversed);
          UI.hideUnitInfo();
          break;
        }
        case "battleInit": {
          console.log("battle started.");
          break;
        }
        case "unitAttack": {
          let { battleId, attacker, target, damage } = data;
          if (Battle_default.id != battleId) return;
          Battle_default.attack(attacker, target, damage);
          break;
        }
        case "unitCast": {
          let { battleId, uid } = data;
          if (Battle_default.id != battleId) return;
          Battle_default.cast(uid);
          break;
        }
        case "unitManaGen": {
          let { battleId, uid, mp } = data;
          if (Battle_default.id != battleId) return;
          Battle_default.manaGen(uid, mp);
          break;
        }
        case "unitMove": {
          let { battleId, uid, nextX, nextY } = data;
          if (Battle_default.id != battleId) return;
          Battle_default.move(uid, nextX, nextY);
          break;
        }
        case "unitDie": {
          let { battleId, uid } = data;
          if (Battle_default.id != battleId) return;
          Battle_default.die(uid);
          break;
        }
        case "unitItemUpdate": {
          let { battleId, unit } = data;
          if (Battle_default.id != battleId) return;
          Battle_default.itemUpdate(unit);
          break;
        }
        case "synergiesUpdate": {
          Player.getPlayerById(data.player)._synergies = data.synergies;
          break;
        }
        case "winningUpdate": {
          Player.getPlayerById(data.player)._winning = data.winning;
          break;
        }
        case "losingUpdate": {
          Player.getPlayerById(data.player)._losing = data.losing;
          break;
        }
        case "gameEnd": {
          if (data.winner === _Socket.id) {
            if (User.isAuthenticated()) User.saveLog("win");
            alert(getText(WIN));
          } else {
            if (User.isAuthenticated()) User.saveLog("lose");
            alert(getText(LOSE));
          }
          UI.gameEnd();
          break;
        }
      }
    };
    _Socket.socket.onclose = function(event) {
      blockPlayBtn(getText(WAITING_FOR_CONNECTION));
      console.log("Socket disconnected, reconnection on progress...");
      _Socket.init();
    };
    _Socket.socket.onerror = function(event) {
      console.error(event);
    };
  }
  static sendMsg(type, data) {
    _Socket.socket.send(
      JSON.stringify({
        from: _Socket.id,
        type,
        data
      })
    );
  }
};
__publicField(_Socket, "socket", null);
__publicField(_Socket, "id", getCookie("tempId"));
var Socket = _Socket;
function readyToPlay() {
  document.getElementById("id").innerHTML = Socket.id;
  const playBtn = document.getElementById("playBtn");
  playBtn.className = "btnActive btn";
  playBtn.disabled = false;
  const playBtnText = document.getElementById("playBtnText");
  playBtnText.innerHTML = `<span>${getText(MATCH)}</span>`;
}
function blockPlayBtn(text) {
  const playBtn = document.getElementById("playBtn");
  playBtn.className = "btnInactive btn btnWide";
  playBtn.disabled = true;
  const playBtnText = document.getElementById("playBtnText");
  playBtnText.innerHTML = `<span>${text}</span>`;
}

// client/javascripts/modules/Player.js
var _Player = class _Player {
  /**
   * @param {String} id
   * @returns {Player}
   */
  static getPlayerById(id) {
    return _Player.players.find((player) => player.id === id);
  }
  constructor(id) {
    _Player.players.push(this);
    this.id = id;
    if (id === Socket.id) _Player.player = this;
    this.board = [
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null]
    ];
    this.queue = [null, null, null, null, null, null, null];
    this.items = [null, null, null, null, null, null];
    this.synergies = {};
    this.damageChart = {};
  }
  set _money(newMoney) {
    this.money = newMoney;
    if (this.id !== Socket.id) return;
    document.getElementById("money").innerHTML = newMoney;
  }
  set _exp(newExp) {
    this.exp = newExp;
    if (this.id !== Socket.id) return;
    document.getElementById("curExp").innerHTML = newExp;
  }
  set _level(newLevel) {
    this.level = newLevel;
    if (this.id !== Socket.id) return;
    document.getElementById("level").innerHTML = newLevel;
  }
  set _maxExp(newMaxExp) {
    this.maxExp = newMaxExp;
    if (this.id !== Socket.id) return;
    document.getElementById("maxExp").innerHTML = newMaxExp;
  }
  set _hp(newHp) {
    this.hp = newHp;
    let el = document.getElementById(`${this.id}-hp`);
    if (el) el.innerHTML = newHp;
  }
  set _board(newBoard) {
    this.board = newBoard.map(
      (row) => row.map((cat) => cat ? new Unit(cat) : null)
    );
    if (this.id !== Socket.id) return;
    if (Game.state != GAME_STATES.ARRANGE) return;
    Painter._board = [
      ...new Array(3).fill(null).map(() => new Array(5).fill(null)),
      ...this.board
    ];
  }
  set _queue(newQueue) {
    this.queue = newQueue.map((cat) => cat ? new Unit(cat) : null);
    if (this.id !== Socket.id) return;
    Painter._allyQueue = this.queue;
  }
  set _shop(newShop) {
    this.shop = newShop;
    if (this.id !== Socket.id) return;
    let shopListEl = document.getElementsByClassName("shopListWrapper");
    for (let i = 0; i < newShop.length; i++) {
      if (!newShop[i]) {
        shopListEl[i].style.visibility = "hidden";
        continue;
      }
      const unitPrototype = Unit.CATS.find(
        (cat) => cat.id === newShop[i].id
      );
      shopListEl[i].style.visibility = "visible";
      let shopImageWrapper = shopListEl[i].getElementsByClassName("shopImageWrapper")[0];
      shopImageWrapper.style.backgroundImage = `url(/images/portraits/${unitPrototype.id}.jpg)`;
      let name = shopListEl[i].getElementsByClassName("shopUnitName")[0];
      name.innerHTML = unitPrototype.name;
      name.style.color = COST_COLORS[unitPrototype.cost];
      let cost = shopListEl[i].getElementsByClassName("shopUnitCost")[0];
      cost.innerHTML = unitPrototype.cost;
      let synergiesEl = shopListEl[i].getElementsByClassName("shopSynergies")[0];
      synergiesEl.innerHTML = "";
      for (let synergy of newShop[i].synergies)
        synergiesEl.appendChild(Synergy.getSynergy(synergy).display());
    }
  }
  set _winning(newWinning) {
    this.winning = parseInt(newWinning);
    if (this.id !== Socket.id) return;
    if (newWinning === 0) return;
  }
  get _winning() {
    return this.winning;
  }
  set _losing(newLosing) {
    this.losing = parseInt(newLosing);
    if (this.id !== Socket.id) return;
    if (newLosing === 0) return;
  }
  get _losing() {
    return this.losing;
  }
  set _items(newItems) {
    this.items = newItems;
    if (this.id !== Socket.id) return;
    for (let i = 0; i < newItems.length; i++) {
      let itemEl = document.getElementById(
        `inventory-${parseInt(i / 2)}-${i % 2}`
      );
      if (!newItems[i]) {
        itemEl.innerHTML = "";
        itemEl.draggable = false;
        continue;
      }
      itemEl.draggable = true;
      itemEl.innerHTML = "";
      itemEl.appendChild(newItems[i].imageEl);
    }
  }
  set _synergies(newSynergies) {
    this.synergies = newSynergies;
    if (this.id !== Socket.id) return;
    let synergiesEl = document.getElementById("synergies");
    synergiesEl.innerHTML = "";
    for (let synergy in newSynergies) {
      synergiesEl.appendChild(
        Synergy.getSynergy(synergy).display(
          newSynergies[synergy] ? newSynergies[synergy].length : 0
        )
      );
    }
  }
  updateDamage(unit, damage) {
    if (this.damageChart[unit.uid]) {
      this.damageChart[unit.uid] += damage;
      document.getElementById(`${unit.uid}-damage`).innerHTML = `${unit.name}${"\u2605".repeat(unit.tier)}: ${this.damageChart[unit.uid]}`;
    } else {
      this.damageChart[unit.uid] = damage;
      const damageChartEl = document.getElementById("damage");
      const damageEl = document.createElement("div");
      damageEl.id = `${unit.uid}-damage`;
      damageEl.className = "damage";
      damageEl.innerHTML = `${unit.name}${"\u2605".repeat(
        unit.tier
      )}: ${damage}`;
      damageEl.style.color = unit.color;
      damageChartEl.appendChild(damageEl);
    }
  }
};
__publicField(_Player, "player", null);
__publicField(_Player, "players", []);
var Player = _Player;

// client/javascripts/modules/Game.js
var Game = class _Game {
  static init(players) {
    _Game.players = players.map((id) => {
      const p = Player.getPlayerById(id);
      if (p) return p;
      else return new Player(id);
    });
    _Game.displayPlayersInfo();
  }
  static displayPlayersInfo() {
    let playersEl = document.getElementById("playersHp");
    playersEl.innerHTML = "";
    _Game.players.forEach((player) => {
      let playerDiv = document.createElement("div");
      playerDiv.id = `player-${player.id}`;
      playerDiv.className = "player";
      let playerId = document.createElement("div");
      playerId.innerHTML = player.id;
      playerDiv.appendChild(playerId);
      let playerHp = document.createElement("div");
      playerHp.id = `${player.id}-hp`;
      playerHp.innerHTML = player.hp;
      playerDiv.appendChild(playerHp);
      playerDiv.appendChild(document.createElement("div"));
      playersEl.appendChild(playerDiv);
    });
  }
  static displayCatInfo(cat) {
    let catInfo = document.createElement("div");
    catInfo.id = "catInfo";
    catInfo.innerHTML = cat.info();
    document.getElementById("rightWrapper").appendChild(catInfo);
  }
  static set _state(newState) {
    this.state = newState;
  }
  static set _time(newTime) {
    _Game.time = newTime;
    document.getElementById("timer").innerHTML = newTime;
  }
  static set _round(newRound) {
    _Game.round = newRound;
  }
  static set _stage(newStage) {
    _Game.stage = newStage;
  }
};

// client/javascripts/modules/Battle.js
var _Battle = class _Battle {
  static ready(reversed) {
    this.reversed = reversed;
    if (reversed)
      _Battle.board = _Battle.board.map((row) => row.reverse()).reverse();
    this.board.forEach((row) => {
      row.forEach((cat) => {
        if (!cat) return;
        cat.inBattle = true;
        cat.mp = 0;
      });
    });
    Painter._board = _Battle.board;
    Player.players.forEach((p) => p.damageChart = {});
    document.getElementById("damage").innerHTML = "";
  }
  static getUnitByUid(uid) {
    let unit;
    this.board.forEach((row) => {
      row.forEach((u) => {
        if (!u) return;
        if (u.uid == uid) unit = u;
      });
    });
    return unit;
  }
  static attack(attacker, target, damage) {
    let attackerCat = this.getUnitByUid(attacker.uid);
    let targetCat = this.getUnitByUid(target.uid);
    if (!attackerCat || !targetCat) return;
    attackerCat.attack(targetCat);
    targetCat._hp = parseInt(target.hp);
    Painter.hitEffect(attackerCat, targetCat, damage);
    if (attackerCat.owner === Player.player.id)
      Player.getPlayerById(attackerCat.owner).updateDamage(
        attackerCat,
        damage
      );
  }
  static die(uid) {
    let cat = this.getUnitByUid(uid);
    if (!cat) return;
    cat.die();
    _Battle.board[this.reversed ? 5 - cat.y : cat.y][this.reversed ? 4 - cat.x : cat.x] = null;
  }
  static move(uid, nextX, nextY) {
    let cat = this.getUnitByUid(uid);
    if (!cat) return;
    const beforeX = cat.x;
    const beforeY = cat.y;
    cat.move(nextX, nextY);
    if (this.reversed) {
      _Battle.board[5 - beforeY][4 - beforeX] = null;
      _Battle.board[5 - nextY][4 - nextX] = cat;
    } else {
      _Battle.board[beforeY][beforeX] = null;
      _Battle.board[nextY][nextX] = cat;
    }
    cat.x = nextX;
    cat.y = nextY;
  }
  static cast(uid) {
    let cat = this.getUnitByUid(uid);
    if (!cat) return;
    cat._mp = cat.mp - cat.maxMp;
    cat.cast();
  }
  static manaGen(uid, mp) {
    let cat = this.getUnitByUid(uid);
    if (!cat) return;
    cat._mp = mp;
  }
  static itemUpdate(data) {
    let unit = this.getUnitByUid(data.uid);
    unit.items = data.items.map((item) => new Item(item));
    Painter.createItemMesh(unit);
  }
};
__publicField(_Battle, "board", []);
var Battle = _Battle;
var Battle_default = Battle;

// client/javascripts/modules/Sound.js
var _Sound = class _Sound {
  static playClick() {
    if (_Sound.muted) return;
    const randIdx = Math.floor(Math.random() * 7);
    _Sound.taps[randIdx].play();
  }
  static mute() {
    _Sound.muted = !_Sound.muted;
  }
};
__publicField(_Sound, "muted", true);
__publicField(_Sound, "taps", []);
var Sound = _Sound;
for (let i = 0; i < 7; i++) {
  Sound.taps.push(new Audio(`/audio/tap/tap${i}.wav`));
  Sound.taps[i].volume = 0.4;
}

// client/javascripts/modules/UI.js
var _UI = class _UI {
  static init(playable = true) {
    scroll();
    createUnitCards();
    User.init();
    this.hydrate(playable);
  }
  static hydrate(playable) {
    document.onclick = Sound.playClick;
    document.querySelector("#signinBtn").onclick = User.signIn;
    document.querySelector("#signoutBtn").onclick = User.signOut;
    document.querySelector("#deck").onclick = newMainCard;
    document.querySelector("#fullscreenBtn").onclick = () => {
      fullscreen(document.documentElement);
    };
    document.querySelector("#languageBtn").onclick = languageBtnClick;
    document.querySelector("#ko").onclick = () => {
      languageChange("ko");
    };
    document.querySelector("#en").onclick = () => {
      languageChange("en");
    };
    document.querySelector("#soundBtn").onclick = () => {
      let soundImg = document.querySelector("#soundImg");
      Sound.mute();
      if (Sound.muted) soundImg.setAttribute("src", "/images/home/note2.png");
      else soundImg.setAttribute("src", "/images/home/note.png");
    };
    document.querySelector("#developerBtn").onclick = () => {
      window.open("https://github.com/wndgur2/CatChess");
    };
    if (!playable) {
      document.querySelector("#playBtnText").innerHTML = getText(NOT_SUPPORTED_DEVICE);
      return;
    }
    document.querySelector("#playBtn").onclick = startMatching;
    document.querySelector("#modalClose").onclick = _UI.closeModal;
    document.querySelector("#modalBackdrop").onclick = _UI.closeModal;
    document.querySelector("#surrenderBtn").onclick = () => {
      const surrenderEl = document.querySelector("#surrenderWrapper");
      _UI.openModal(surrenderEl.innerHTML);
      document.querySelector("#surrenderConfirm").onclick = () => {
        Socket.sendMsg("reqSurrender", "");
        _UI.closeModal();
      };
    };
    document.querySelector("#reload").onclick = () => {
      Socket.sendMsg("reqReload", "");
    };
    document.onkeypress = (event) => {
      switch (event.key.toUpperCase()) {
        case "D":
          Socket.sendMsg("reqReload", "");
          break;
        case "\u3147":
          Socket.sendMsg("reqReload", "");
          break;
        case "F":
          Socket.sendMsg("reqBuyExp", "");
          break;
        case "\u3139":
          Socket.sendMsg("reqBuyExp", "");
          break;
        case "E":
          Painter.sellUnitOnKeypress();
          break;
        case "\u3137":
          Painter.sellUnitOnKeypress();
          break;
      }
    };
    document.querySelector("#buyExp").onclick = () => {
      Socket.sendMsg("reqBuyExp", "");
    };
    let shopEl = document.querySelector("#shop");
    shopEl.onmouseenter = shopMouseEnter;
    shopEl.onmouseleave = shopMouseLeave;
    shopEl.onpointerup = shopPointerUp;
    let shoplistEl = document.querySelector("#shoplist");
    for (let i = 0; i < shoplistEl.children.length; ++i) {
      shoplistEl.children[i].onclick = () => {
        if (!Player.player.shop[i]) return;
        Socket.sendMsg("reqBuyCat", {
          index: i
        });
        _UI.popDown();
      };
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        let item = document.querySelector(`#inventory-${i}-${j}`);
        item.ondragstart = inventoryDragStart;
        item.draggable = false;
        item.onmousemove = inventoryItemMouseMove;
        item.onmouseleave = inventoryItemMouseLeave;
      }
    }
    let itemEls = document.getElementsByClassName("item");
    for (let i = 0; i < itemEls.length; i++) {
      itemEls[i].onmousemove = itemMouseMove;
      itemEls[i].onmouseout = itemMouseLeave;
    }
    let skillEl = document.getElementById("unitSkillWrapper");
    skillEl.onmousemove = skillMouseMove;
    skillEl.onmouseout = skillMouseLeave;
    onclose = () => {
      Painter.running = false;
    };
  }
  static openModal(content, callback) {
    console.log("open modal");
    const modalEl = document.getElementById("modal");
    modalEl.style.opacity = "1";
    modalEl.style.visibility = "visible";
    const modalBodyEl = document.getElementById("modalBody");
    modalBodyEl.innerHTML = content;
    if (callback) _UI.callback = callback;
  }
  static closeModal() {
    const modalEl = document.getElementById("modal");
    if (_UI.callback) {
      _UI.callback();
      _UI.callback = null;
    }
    modalEl.style.opacity = "0";
    setTimeout(() => {
      modalEl.style.visibility = "hidden";
    }, 200);
  }
  static getCellUnitByCellId(id) {
    let position = id.split("-");
    switch (Game.state) {
      case "arrange":
        if (position[0] === "ally") return Player.player.board[position[1]][position[2]];
        else return Player.player.queue[position[2]];
      default:
        if (position[0] === "ally") return Battle_default.board[parseInt(position[1]) + 3][position[2]];
        else if (position[0] === "enemy") return Battle_default.board[position[1]][position[2]];
        else return Player.player.queue[position[2]];
    }
  }
  static popUp(html, mouseEvent) {
    let popUpEl = document.getElementById("popUp");
    popUpEl.innerHTML = html;
    popUpEl.style.display = "flex";
    if (mouseEvent.clientX + popUpEl.clientWidth > window.innerWidth)
      popUpEl.style.left = mouseEvent.clientX - popUpEl.clientWidth + "px";
    else popUpEl.style.left = mouseEvent.clientX + "px";
    if (mouseEvent.clientY + popUpEl.clientHeight > window.innerHeight)
      popUpEl.style.top = mouseEvent.clientY - popUpEl.clientHeight + "px";
    else popUpEl.style.top = mouseEvent.clientY + "px";
  }
  static popDown() {
    let popUpEl = document.getElementById("popUp");
    popUpEl.style.display = "none";
  }
  static showUnitInfo(unit) {
    this.infoUnit = unit;
    let unitInfoEl = document.getElementById("unitInfo");
    unit.showInfo();
    unitInfoEl.style.display = "flex";
    let shopEl = document.getElementById("shop");
    shopEl.style.display = "none";
  }
  static hideUnitInfo() {
    let unitInfoEl = document.getElementById("unitInfo");
    unitInfoEl.style.display = "none";
    if (this.infoUnit) this.infoUnit.focused = false;
    this.infoUnit = null;
    let sellEl = document.getElementById("sell");
    sellEl.style.display = "none";
    let shoplistEl = document.getElementById("shoplist");
    shoplistEl.style.display = "flex";
    let shopEl = document.getElementById("shop");
    shopEl.style.display = "flex";
  }
  static gameStart() {
    _UI.closeModal();
    document.getElementById("home").style.display = "none";
    document.getElementById("game").style.display = "flex";
    fullscreen(document.getElementById("game"));
    Painter.startRender();
  }
  static gameEnd() {
    Painter.running = false;
    cancelMatching();
    document.getElementById("game").style.display = "none";
    document.getElementById("home").style.display = "inline-block";
    User.authenticate();
    Painter.clearUnits();
  }
};
__publicField(_UI, "draggingId");
__publicField(_UI, "isDragging", false);
__publicField(_UI, "infoUnit");
__publicField(_UI, "muted", true);
var UI = _UI;
function inventoryDragStart(event) {
  UI.draggingId = event.target.id;
  UI.isDragging = true;
}
function inventoryItemMouseMove(event) {
  let index = parseInt(this.id.split("-")[1]) * 2 + parseInt(this.id.split("-")[2]);
  if (Player.player.items[index]) UI.popUp(Player.player.items[index].info(), event);
}
function inventoryItemMouseLeave(event) {
  UI.popDown();
}
function itemMouseMove(event) {
  if (UI.infoUnit.items[this.id]) UI.popUp(UI.infoUnit.items[this.id].info(), event);
}
function itemMouseLeave(event) {
  UI.popDown();
}
function skillMouseMove(event) {
  UI.popUp(UI.infoUnit.skillInfo(), event);
}
function skillMouseLeave(event) {
  UI.popDown();
}
function shopMouseEnter(event) {
  if (!Painter.isDragging) return;
  event.preventDefault();
  let shoplistEl = document.getElementById("shoplist");
  shoplistEl.style.display = "none";
  let sellEl = document.getElementById("sell");
  sellEl.innerHTML = `\uACE0\uC591\uC774 \uD310\uB9E4\uD558\uAE30 [E]<br/>\u{1F4B0}${Painter.draggingObject.unit.cost}`;
  sellEl.style.display = "flex";
}
function shopMouseLeave(event) {
  if (!Painter.isDragging) return;
  event.preventDefault();
  let sellEl = document.getElementById("sell");
  sellEl.style.display = "none";
  let shoplistEl = document.getElementById("shoplist");
  shoplistEl.style.display = "flex";
}
function shopPointerUp(event) {
  if (!Painter.isDragging) return;
  Socket.sendMsg("reqSellCat", {
    uid: Painter.draggingObject.unit.uid
  });
  let sellEl = document.getElementById("sell");
  sellEl.style.display = "none";
  let shoplistEl = document.getElementById("shoplist");
  shoplistEl.style.display = "flex";
  Player.player._shop = Player.player.shop;
}
function startMatching() {
  Socket.sendMsg("startMatching", "");
  const playBtn = document.getElementById("playBtn");
  const playBtnText = document.getElementById("playBtnText");
  playBtn.className = "btnWide btn";
  let mouseOver = false;
  let matchingTime = 0;
  let timeText = "00:00";
  playBtnText.innerHTML = timeText;
  UI.interval = setInterval(() => {
    matchingTime++;
    const minute = Math.floor(matchingTime / 60);
    const second = matchingTime % 60;
    timeText = `${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}`;
    if (mouseOver) return;
    playBtnText.innerHTML = timeText;
  }, 1e3);
  playBtn.onclick = () => {
    cancelMatching();
    playBtn.onclick = startMatching;
  };
  playBtn.onmouseover = () => {
    mouseOver = true;
    playBtnText.innerHTML = getText(CANCEL_MATCHING);
  };
  playBtn.onmouseout = () => {
    mouseOver = false;
    playBtnText.innerHTML = timeText;
  };
}
function cancelMatching() {
  Socket.sendMsg("cancelMatching", "");
  clearInterval(UI.interval);
  const playBtn = document.getElementById("playBtn");
  playBtn.className = `btnActive btn`;
  playBtn.onmouseover = null;
  playBtn.onmouseout = null;
  const playBtnText = document.getElementById("playBtnText");
  playBtnText.innerHTML = getText(MATCH);
}
function scroll() {
  if (!getCookie("scroll")) return;
  window.scrollTo(0, parseInt(getCookie("scroll")));
  document.cookie = "scroll=0";
}
function createUnitCards() {
  newMainCard();
  loadDescCards();
}
function newMainCard() {
  const MAX_AMOUNT = 5;
  const cards = document.getElementById("cards");
  const currentCats = [...cards.children].map((card) => card.id);
  const values = Object.values(Unit.CATS).filter((value) => !currentCats.includes(value.id));
  if (values.length > 0) {
    if (cards.children.length >= MAX_AMOUNT) {
      const i = cards.children.length - MAX_AMOUNT;
      cards.children[i].setAttribute(
        "style",
        "width: 0px; margin:0px; opacity: 0; pointer-events: none;"
      );
      setTimeout(() => {
        if (cards.children.length > MAX_AMOUNT) cards.removeChild(cards.children[0]);
      }, 400);
    }
    const cat = values[Math.floor(Math.random() * values.length)];
    const cardWrapper = newCard("main", cat);
    cards.appendChild(cardWrapper);
    setTimeout(() => {
      cardWrapper.style.opacity = "1";
      cardWrapper.style.width = "11dvw";
      cardWrapper.onmouseover = (e) => {
        cardWrapper.style.width = "12dvw";
      };
      cardWrapper.onmouseout = (e) => {
        cardWrapper.style.width = "11dvw";
      };
    }, 20);
  }
}
function loadDescCards() {
  var timeout;
  ["Poeir", "Therme", "Nature"].forEach((synergy) => {
    const cats = Object.values(Unit.CATS).filter((cat) => cat.synergies.includes(synergy));
    cats.forEach((cat) => {
      const cardWrapper = newCard("desc", cat);
      cardWrapper.onmouseenter = () => {
        if (timeout) clearTimeout(timeout);
        const popUp = document.getElementById("unitPopUpWrapper");
        popUp.style.visibility = "visible";
        popUp.style.opacity = "1";
        const popUpImage = document.getElementById("popUpImage");
        popUpImage.onerror = () => {
          popUpImage.src = `/images/portraits/${cat.id}.jpg`;
        };
        popUpImage.src = `/images/fullbody/${cat.id}.jpg`;
      };
      cardWrapper.onmouseleave = () => {
        const popUp = document.getElementById("unitPopUpWrapper");
        popUp.style.opacity = "0";
        timeout = setTimeout(() => {
          popUp.style.visibility = "hidden";
        }, 200);
      };
      document.getElementById(synergy).appendChild(cardWrapper);
    });
  });
  const creeps = Unit.CREEPS;
  for (const creep in creeps) {
    document.getElementById("Creep").appendChild(newCard("desc", creeps[creep]));
  }
}
function newCard(type, cat) {
  let cardWrapper = document.createElement("div");
  cardWrapper.id = cat.id;
  cardWrapper.className = type == "main" ? "mainCardWrapper" : "cardWrapper";
  let card = document.createElement("div");
  card.className = type == "main" ? "mainCard" : "card";
  cardWrapper.appendChild(card);
  let cardImgWrapper = document.createElement("div");
  cardImgWrapper.className = "cardImgWrapper";
  card.appendChild(cardImgWrapper);
  let cardImg = document.createElement("img");
  cardImg.className = "cardImg";
  cardImg.src = `/images/portraits/${cat.id}.jpg`;
  cardImgWrapper.appendChild(cardImg);
  let cardDescWrapper = document.createElement("div");
  cardDescWrapper.className = "cardDescWrapper";
  cardDescWrapper.style.wordBreak = "break-all";
  let cardName = document.createElement("span");
  cardName.className = "cardName";
  cardName.innerHTML = cat.name;
  cardDescWrapper.appendChild(cardName);
  let cardDesc = document.createElement("span");
  cardDesc.className = "cardDesc";
  cardDesc.innerHTML = cat.desc;
  cardDescWrapper.appendChild(cardDesc);
  card.appendChild(cardDescWrapper);
  return cardWrapper;
}
function fullscreen(el) {
  if (document.fullscreenElement) document.exitFullscreen();
  else el.requestFullscreen();
}
function languageBtnClick() {
  const language = document.getElementById("languagePopUp");
  if (language.style.display === "flex") language.style.display = "none";
  else language.style.display = "flex";
}
function languageChange(language) {
  document.cookie = `scroll=${window.scrollY}`;
  document.cookie = `lang=${language}`;
  location.href = `/?lang=${language}`;
}

// client/javascripts/modules/3D/Cat.js
import * as THREE2 from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
var Cat = class {
  constructor(unit) {
    this.mesh = new THREE2.Group();
    console.log(unit);
    let loader = new GLTFLoader();
    loader.load(`/models/cat/${unit.id}.glb`, (glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      glb.scene.scale.set(2, 2, 2);
      glb.scene.rotation.z = -Math.PI / 2;
      glb.scene.rotation.x = -Math.PI / 2;
      this.mesh.add(glb.scene);
    });
    let geometry = new THREE2.BoxGeometry(2, 0.5, 2);
    let material = new THREE2.MeshBasicMaterial({ color: 65280, opacity: 0, transparent: true });
    let clickableMesh = new THREE2.Mesh(geometry, material);
    clickableMesh.position.y = -1;
    this.mesh.add(clickableMesh);
    return this.mesh;
  }
};

// client/javascripts/modules/effects/blood.js
import * as THREE3 from "three";
var numParticles = 15;
var gravity = -9.8;
var groundHeight = new THREE3.Vector3(0, 0, 0);
var _blood_instances, init_fn;
var _blood = class _blood {
  constructor() {
    __privateAdd(this, _blood_instances);
    __publicField(this, "object", new THREE3.Object3D());
    __publicField(this, "duration", 0.8);
    __publicField(this, "targetPosition", new THREE3.Vector3(0, 0, 0));
    __publicField(this, "active", false);
    __publicField(this, "timeElapse", 0);
    __publicField(this, "particles");
    __publicField(this, "particleStart", []);
    __publicField(this, "velocity", new Float32Array(numParticles * 3));
    __publicField(this, "initVelocity", new Float32Array(numParticles * 3));
    __publicField(this, "particleInitSize", 0.3);
    __publicField(this, "localGroundHeight");
    __privateMethod(this, _blood_instances, init_fn).call(this);
    this.SetActive(false);
  }
  Instantiate() {
    return new _blood();
  }
  SetPosition(vec3) {
    this.object.position.set(
      vec3.x + Math.random() * 0.2 - 0.1,
      vec3.y + Math.random() * 0.2 - 0.1,
      vec3.z + Math.random() * 0.2 - 0.1
    );
    let target = groundHeight.clone();
    this.object.worldToLocal(target);
    this.localGroundHeight = target.y;
  }
  SetActive(active) {
    this.active = active;
    if (active) {
      this.object.visible = true;
    } else {
      this.object.visible = false;
    }
  }
  GetActive() {
    return this.active;
  }
  Update(dt) {
    if (!this.active) return;
    if (this.timeElapse >= this.duration) {
      this.SetActive(false);
      this.Reset();
      return;
    }
    const positions = this.object.geometry.attributes.position.array;
    for (let i = 0; i < numParticles; i++) {
      let cur = i * 3;
      if (positions[cur + 1] <= this.localGroundHeight + 0.1) {
        positions[cur + 1] = this.localGroundHeight;
        continue;
      }
      this.velocity[cur];
      this.velocity[cur + 1] += gravity * dt;
      this.velocity[cur + 2];
      positions[cur] += this.velocity[cur] * dt;
      positions[cur + 1] += this.velocity[cur + 1] * dt;
      positions[cur + 2] += this.velocity[cur + 2] * dt;
    }
    this.object.geometry.attributes.position.needsUpdate = true;
    let t = this.timeElapse / this.duration;
    this.object.material.size = (this.particleInitSize - 0) * Math.cos(t * Math.PI / 2);
    this.timeElapse += dt;
  }
  Reset() {
    const positions = this.object.geometry.attributes.position.array;
    for (let i = 0; i < numParticles; ++i) {
      this.velocity[i * 3] = this.initVelocity[i * 3];
      this.velocity[i * 3 + 1] = this.initVelocity[i * 3 + 1];
      this.velocity[i * 3 + 2] = this.initVelocity[i * 3 + 2];
      positions[i * 3] = this.particleStart[i].x;
      positions[i * 3 + 1] = this.particleStart[i].y;
      positions[i * 3 + 2] = this.particleStart[i].z;
    }
    this.timeElapse = 0;
    this.object.geometry.attributes.position.needsUpdate = true;
  }
};
_blood_instances = new WeakSet();
init_fn = function() {
  this.velocity = new Float32Array(numParticles * 3);
  let origin = new THREE3.Vector3(0, 0, 0);
  let t1 = origin.clone().add(
    new THREE3.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    )
  );
  t1.normalize();
  const vertices = [];
  for (let i = 0; i < numParticles; i++) {
    let step = i / numParticles;
    const x = origin.x + step * (t1.x - origin.x);
    const y = origin.y + step * (t1.y - origin.y);
    const z = origin.z + step * (t1.z - origin.z);
    vertices.push(x, y, z);
    let temp = new THREE3.Vector3(x, y, z);
    this.particleStart.push(temp);
  }
  const geometry = new THREE3.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE3.Float32BufferAttribute(vertices, 3)
  );
  const material = new THREE3.PointsMaterial({
    color: 13369344,
    sizeAttenuation: true
  });
  material.size = this.particleInitSize;
  this.object = new THREE3.Points(geometry, material);
  let half = origin.clone().add(t1).multiplyScalar(0.5);
  let perpendicular = generateRandomPerpendicularVector(half);
  perpendicular.normalize();
  let explosionLoc = half.clone().add(perpendicular.multiplyScalar(0.5));
  explosionLoc.y += -0.6;
  explosionLoc.z += -1;
  for (let i = 0; i < numParticles; ++i) {
    let cur = i * 3;
    let noise = Math.random() * 1 + 0;
    let initVec = new THREE3.Vector3(
      vertices[cur] - explosionLoc.x + noise,
      vertices[cur + 1] - explosionLoc.y + noise,
      vertices[cur + 2] - explosionLoc.z + noise
    );
    initVec.normalize();
    this.initVelocity[cur] = initVec.x * 4;
    this.initVelocity[cur + 1] = initVec.y * 4;
    this.initVelocity[cur + 2] = initVec.z * 4;
    this.velocity[cur] = this.initVelocity[cur];
    this.velocity[cur + 1] = this.initVelocity[cur + 1];
    this.velocity[cur + 2] = this.initVelocity[cur + 2];
  }
};
var blood = _blood;
function generateRandomPerpendicularVector(givenVector) {
  var randomVector = new THREE3.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  );
  var perpendicularVector = givenVector.clone().cross(randomVector);
  let length = Math.random() * 1 + 0.1;
  var scaleFactor = length / perpendicularVector.length();
  perpendicularVector.multiplyScalar(scaleFactor);
  return perpendicularVector;
}
var blood_default = blood;

// client/javascripts/modules/effects/Effect.js
import * as THREE4 from "three";
var _Effect_instances, init_fn2;
var Effect = class {
  // virtual function 만드는 법 모름
  constructor() {
    __privateAdd(this, _Effect_instances);
    __publicField(this, "object", new THREE4.Object3D());
    __publicField(this, "duration", 1);
    __publicField(this, "targetPosition", new THREE4.Vector3(0, 0, 0));
    __publicField(this, "active", false);
    __publicField(this, "timeElapse", 0);
  }
  Instantiate() {
  }
  SetPosition(vec3) {
  }
  SetActive(active) {
  }
  GetActive() {
    return this.active;
  }
  Update(dt) {
  }
};
_Effect_instances = new WeakSet();
init_fn2 = function() {
};

// client/javascripts/modules/effects/objectPool.js
var objectPool = class {
  constructor(prefab, count = 20) {
    __publicField(this, "count");
    __publicField(this, "prefab", new Effect());
    __publicField(this, "pool", []);
    this.prefab = prefab;
    this.count = count;
    this.Init();
  }
  Init() {
    for (let i = 0; i < this.count; ++i) {
      this.pool.push(new this.prefab().Instantiate());
    }
  }
  GetObject(position, direction) {
    for (let i = 0; i < this.count; ++i) {
      if (this.pool[i].GetActive()) continue;
      this.pool[i].SetPosition(position);
      this.pool[i].object.lookAt(
        direction.clone().add(this.pool[i].object.position)
      );
      this.pool[i].SetActive(true);
      return this.pool[i];
    }
    return null;
  }
  Update(dt) {
    let cnt = 0;
    for (let i = 0; i < this.count; ++i) {
      this.pool[i].Update(dt);
      if (this.pool[i].GetActive()) {
        ++cnt;
      }
    }
  }
};

// client/javascripts/modules/3D/Painter.js
var _Painter = class _Painter {
  static init() {
    this.scene = new THREE5.Scene();
    this.clock = new THREE5.Clock();
    this.camera = new THREE5.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1e3);
    this.camera.position.set(0, THREE_CONSTS.PLATE_RADIUS * 9, -(THREE_CONSTS.PLATE_RADIUS * 10));
    this.camera.lookAt(0, 0, -THREE_CONSTS.PLATE_RADIUS * 2.8);
    this.scene.add(this.camera);
    const light = new THREE5.HemisphereLight(14540253, 0, 1);
    light.position.set(0, THREE_CONSTS.PLATE_RADIUS * 5, 0);
    this.scene.add(light);
    const pointLight = new THREE5.PointLight(
      15658734,
      25 * Math.pow(THREE_CONSTS.PLATE_RADIUS, 1.5),
      0,
      1.5
    );
    pointLight.position.set(0, THREE_CONSTS.PLATE_RADIUS * 4, 0);
    pointLight.castShadow = true;
    this.scene.add(pointLight);
    this.renderer = new THREE5.WebGLRenderer({
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.id = "scene";
    document.getElementById("game").appendChild(this.renderer.domElement);
    this.outlineEffect = new OutlineEffect(_Painter.renderer);
    this.mouse = new THREE5.Vector2();
    this.raycaster = new THREE5.Raycaster();
    window.addEventListener("resize", onResize);
    this.renderer.domElement.addEventListener("pointerdown", onPointerDown);
    this.renderer.domElement.addEventListener("pointermove", onPointerMove);
    this.renderer.domElement.addEventListener("pointerup", onPointerUp);
    this.renderer.domElement.addEventListener("dragover", onDragOver);
    this.renderer.domElement.addEventListener("drop", onDrop);
    this.hitObjectPool = new objectPool(blood_default, 100);
    this.textureLodaer = new THREE5.TextureLoader();
    this.textures.background = this.textureLodaer.load(
      "/images/grounds/background.jpg",
      (texture) => {
        texture.wrapS = THREE5.RepeatWrapping;
        texture.wrapT = THREE5.RepeatWrapping;
        texture.repeat.set(THREE_CONSTS.PLATE_RADIUS * 5, THREE_CONSTS.PLATE_RADIUS * 5);
      }
    );
    this.textures.board = this.textureLodaer.load("/images/grounds/board.jpg");
    this.textures.queue = this.textureLodaer.load("/images/grounds/queue.jpg");
    var loader = new FontLoader();
    loader.load(
      "https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        _Painter.font = font;
      }
    );
    this.drawBackground();
    this.drawBoard();
  }
  static drawBoard() {
    const floorGeometry = new THREE5.PlaneGeometry(
      THREE_CONSTS.PLATE_RADIUS * 50,
      THREE_CONSTS.PLATE_RADIUS * 50
    );
    const floorMaterial = new THREE5.MeshLambertMaterial({
      color: 0,
      side: THREE5.DoubleSide
    });
    const floor = new THREE5.Mesh(floorGeometry, floorMaterial);
    floor.rotateX(Math.PI / 2);
    floor.position.set(0, 0, 0);
    floor.visible = false;
    floor.name = "floor";
    this.scene.add(floor);
    let plateGeometry = new THREE5.CylinderGeometry(
      THREE_CONSTS.PLATE_RADIUS,
      THREE_CONSTS.PLATE_RADIUS,
      THREE_CONSTS.PLATE_HEIGHT,
      6
    );
    let material = new THREE5.MeshLambertMaterial({
      map: this.textures.board
    });
    THREE_CONSTS.COORDINATES.BOARD.forEach((row, i) => {
      row.forEach((coord, j) => {
        const plate = new THREE5.Mesh(plateGeometry, material);
        plate.position.set(coord[0], coord[1], coord[2]);
        plate.boardCoords = {
          y: i,
          x: j
        };
        if (i >= 3) plate.name = "allyPlate";
        else plate.name = "enemyPlate";
        this.scene.add(plate);
      });
    });
    const boxGeometry = new THREE5.BoxGeometry(
      THREE_CONSTS.BOX_WIDTH,
      THREE_CONSTS.BOX_HEIGHT,
      THREE_CONSTS.BOX_DEPTH
    );
    material = new THREE5.MeshLambertMaterial({
      map: this.textures.queue
    });
    THREE_CONSTS.COORDINATES.ALLY_QUEUE.forEach((coord, i) => {
      const cube = new THREE5.Mesh(boxGeometry, material);
      cube.translateX(coord[0]);
      cube.translateY(coord[1]);
      cube.translateZ(coord[2]);
      cube.name = "allyPlate";
      cube.boardCoords = {
        y: 6,
        x: i
      };
      this.scene.add(cube);
    });
    material = new THREE5.MeshLambertMaterial({
      map: this.textures.queue
    });
    THREE_CONSTS.COORDINATES.ENEMY_QUEUE.forEach((coord, i) => {
      const cube = new THREE5.Mesh(boxGeometry, material);
      cube.translateX(coord[0]);
      cube.translateY(coord[1]);
      cube.translateZ(coord[2]);
      cube.name = "enemyPlate";
      this.scene.add(cube);
    });
  }
  static drawBackground() {
    const backgroundGeometry = new THREE5.PlaneGeometry(
      THREE_CONSTS.PLATE_RADIUS * 50,
      THREE_CONSTS.PLATE_RADIUS * 50
    );
    const backgroundMaterial = new THREE5.MeshLambertMaterial({
      map: this.textures.background,
      side: THREE5.DoubleSide
    });
    const background = new THREE5.Mesh(backgroundGeometry, backgroundMaterial);
    background.rotateX(Math.PI / 2);
    background.position.set(0, -THREE_CONSTS.PLATE_RADIUS / 10, 0);
    background.name = "background";
    this.scene.add(background);
    const loader = new GLTFLoader2();
    loader.load(
      "models/concrete_fence/scene.gltf",
      function(gltf) {
        let object = gltf.scene.clone();
        object.scale.set(0.05, 0.05, 0.05);
        object.rotateY(-Math.PI + 0.1);
        object.position.set(-27, 0, 7);
        _Painter.scene.add(object);
        object = gltf.scene.clone();
        object.scale.set(0.05, 0.05, 0.05);
        object.rotateY(-Math.PI);
        object.position.set(-23, 0, 5);
        _Painter.scene.add(object);
        object = gltf.scene.clone();
        object.scale.set(0.05, 0.05, 0.05);
        object.rotateY(-Math.PI - 0.1);
        object.position.set(-19, 0, 1);
        _Painter.scene.add(object);
        object = gltf.scene.clone();
        object.scale.set(0.05, 0.05, 0.05);
        object.rotateY(Math.PI - 0.2);
        object.position.set(-18, 0, -10);
        _Painter.scene.add(object);
      },
      void 0,
      function(error) {
        console.log(error);
      }
    );
    loader.load(
      "models/box/scene.gltf",
      function(gltf) {
        let object = gltf.scene;
        object.scale.set(0.05, 0.05, 0.05);
        object.position.set(20, 0, -4);
        object.rotateY(-(Math.PI / 2) + 0.1);
        _Painter.scene.add(object);
      },
      void 0,
      function(error) {
        console.error(error);
      }
    );
    loader.load(
      "models/elec/scene.gltf",
      function(gltf) {
        let object = gltf.scene.clone();
        object.scale.set(2, 2, 2);
        object.position.set(-12, 0, 9);
        object.rotateY(Math.PI / 20);
        _Painter.scene.add(object);
        object = gltf.scene.clone();
        object.scale.set(2, 2, 2);
        object.position.set(-15, 0, 9);
        object.rotateY(-Math.PI / 12);
        _Painter.scene.add(object);
        object = gltf.scene.clone();
        object.scale.set(2, 2, 2);
        object.position.set(12, 0, -11);
        object.rotateY(Math.PI);
        _Painter.scene.add(object);
        object = gltf.scene.clone();
        object.scale.set(2, 2, 2);
        object.position.set(16, 0, 11);
        object.rotateY(Math.PI / 12);
        _Painter.scene.add(object);
      },
      void 0,
      function(error) {
        console.error(error);
      }
    );
    loader.load(
      "models/cabinet/scene.gltf",
      function(gltf) {
        let object = gltf.scene;
        object.scale.set(8, 8, 8);
        object.position.set(0, 16, 22);
        object.rotateY(-Math.PI);
        _Painter.scene.add(object);
      },
      void 0,
      function(error) {
        console.error(error);
      }
    );
  }
  static clearUnits() {
    this.scene.children.forEach((child) => {
      if (child.name === "unit") this.scene.remove(child);
    });
    this.running = false;
  }
  static startRender() {
    if (!this.running) {
      this.running = true;
      this.animate();
    }
  }
  static animate() {
    if (!_Painter.running) return;
    requestAnimationFrame(_Painter.animate);
    const dt = _Painter.clock.getDelta();
    _Painter.hitObjectPool.Update(dt);
    _Painter.outlineEffect.render(_Painter.scene, _Painter.camera);
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
    const coords = onBoard ? getBoardCoords(unit.x, unit.y) : getQueueCoords(unit.x, unit.owner === Player.player.id);
    unit.mesh.position.set(
      coords[0],
      coords[1] + (THREE_CONSTS.CAT_HEIGHT + THREE_CONSTS.PLATE_HEIGHT) / 2,
      coords[2]
    );
    this.scene.add(unit.mesh);
  }
  static createUnitMesh(unit) {
    unit.mesh = new THREE5.Group();
    unit.mesh.name = "unit";
    const bodyMesh = new Cat(unit);
    bodyMesh.name = "unitBody";
    bodyMesh.unit = unit;
    if (unit.owner != Player.player.id) bodyMesh.rotateY(Math.PI);
    unit.mesh.add(bodyMesh);
    const healthBarY = THREE_CONSTS.CAT_HEIGHT + THREE_CONSTS.ITEM_WIDTH + THREE_CONSTS.MANABAR_HEIGHT + THREE_CONSTS.STATS_GAP * 2;
    const healthBarBackgroundMesh = new THREE5.Mesh(
      new THREE5.BoxGeometry(
        THREE_CONSTS.HEALTHBAR_WIDTH,
        THREE_CONSTS.HEALTHBAR_HEIGHT,
        THREE_CONSTS.HEALTHBAR_DEPTH / 3
      ),
      new THREE5.MeshBasicMaterial({ color: 0 })
    );
    healthBarBackgroundMesh.name = "healthBarBackground";
    healthBarBackgroundMesh.position.set(0, healthBarY, 0);
    unit.mesh.add(healthBarBackgroundMesh);
    const damagedHealthMesh = new THREE5.Mesh(
      new THREE5.BoxGeometry(
        THREE_CONSTS.HEALTHBAR_WIDTH,
        THREE_CONSTS.HEALTHBAR_HEIGHT,
        THREE_CONSTS.HEALTHBAR_DEPTH / 2
      ),
      new THREE5.MeshBasicMaterial({ color: 13369344 })
    );
    damagedHealthMesh.name = "damagedHealthBar";
    damagedHealthMesh.position.set(0, healthBarY, 0);
    unit.mesh.add(damagedHealthMesh);
    const healthBarMesh = new THREE5.Mesh(
      new THREE5.BoxGeometry(
        THREE_CONSTS.HEALTHBAR_WIDTH,
        THREE_CONSTS.HEALTHBAR_HEIGHT,
        THREE_CONSTS.HEALTHBAR_DEPTH
      ),
      new THREE5.MeshBasicMaterial({ color: 43520 })
    );
    healthBarMesh.name = "healthBar";
    healthBarMesh.position.set(0, healthBarY, 0);
    unit.mesh.add(healthBarMesh);
    const manaBarMesh = new THREE5.Mesh(
      new THREE5.BoxGeometry(
        THREE_CONSTS.MANABAR_WIDTH,
        THREE_CONSTS.MANABAR_HEIGHT,
        THREE_CONSTS.MANABAR_HEIGHT / 10
      ),
      new THREE5.MeshBasicMaterial({ color: 17578 })
    );
    manaBarMesh.name = "manaBar";
    manaBarMesh.position.set(0, healthBarY - THREE_CONSTS.HEALTHBAR_HEIGHT, 0);
    manaBarMesh.position.x = THREE_CONSTS.MANABAR_WIDTH / 2;
    manaBarMesh.scale.x = 0;
    unit.mesh.add(manaBarMesh);
    this.createItemMesh(unit);
  }
  static createItemMesh(unit) {
    let count = 0;
    unit.mesh.children.forEach((child) => {
      if (child.name === "item") count++;
    });
    unit.items.forEach((item, i) => {
      if (i < count) return;
      const itemMesh = new THREE5.Mesh(
        new THREE5.BoxGeometry(
          THREE_CONSTS.ITEM_WIDTH,
          THREE_CONSTS.ITEM_WIDTH,
          THREE_CONSTS.HEALTHBAR_HEIGHT / 10
        ),
        new THREE5.MeshBasicMaterial({
          map: new THREE5.TextureLoader().load(item.imageEl.src)
        })
      );
      itemMesh.name = "item";
      itemMesh.position.set(
        (1 - i) * (THREE_CONSTS.ITEM_WIDTH + THREE_CONSTS.STATS_GAP),
        THREE_CONSTS.CAT_HEIGHT,
        0
      );
      itemMesh.item = item;
      unit.mesh.add(itemMesh);
    });
  }
  static hitEffect(attacker, target, damage) {
    this.scene.add(
      this.hitObjectPool.GetObject(target.mesh.position, attacker.mesh.position).object
    );
  }
  static sellUnitOnKeypress() {
    _Painter.raycaster.setFromCamera(_Painter.mouse, _Painter.camera);
    const intersects = _Painter.raycaster.intersectObjects(_Painter.scene.children);
    intersects.forEach((intersect) => {
      const object = intersect.object;
      if (object.parent.name === "unitBody") {
        if (object.parent.unit.owner !== Player.player.id) return;
        if (object.parent.unit.inBattle) return;
        Socket.sendMsg("reqSellCat", {
          uid: object.parent.unit.uid
        });
      }
    });
  }
  static castEffect(unit) {
    const textGeo = new TextGeometry(unit.skill.name + "!", {
      font: _Painter.font,
      size: 0.6,
      depth: 0.1
    });
    const textMaterial = new THREE5.MeshBasicMaterial({
      color: 13386820
    });
    const textMesh = new THREE5.Mesh(textGeo, textMaterial);
    textMesh.rotateY(Math.PI);
    textMesh.position.set(
      unit.mesh.position.x + THREE_CONSTS.PLATE_RADIUS / 2,
      THREE_CONSTS.CAT_HEIGHT * 2,
      unit.mesh.position.z
    );
    _Painter.scene.add(textMesh);
    const duration = 33;
    let i = 0;
    function moveText() {
      if (i++ < duration) {
        textMesh.translateY(0.05);
        textMesh.material.opacity -= 0.03;
        requestAnimationFrame(moveText);
      } else _Painter.scene.remove(textMesh);
    }
    moveText();
  }
};
__publicField(_Painter, "board", new Array(6).fill(null).map(() => new Array(5).fill(null)));
__publicField(_Painter, "enemyQueue", new Array(7).fill(null));
__publicField(_Painter, "allyQueue", new Array(7).fill(null));
__publicField(_Painter, "draggingObject", null);
__publicField(_Painter, "isDragging", false);
__publicField(_Painter, "textures", {});
__publicField(_Painter, "running", false);
var Painter = _Painter;
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
  Painter.mouse.x = event.clientX / window.innerWidth * 2 - 1;
  Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  Painter.dragStart = Painter.mouse.clone();
  const unitObject = getRaycastedUnitObject();
  console.log(unitObject);
  if (unitObject) {
    if (unitObject.unit.inBattle) return;
    Painter.isDragging = true;
    Painter.draggingObject = unitObject;
  }
  UI.hideUnitInfo();
}
function onPointerMove(event) {
  Painter.mouse.x = event.clientX / window.innerWidth * 2 - 1;
  Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (!Painter.isDragging) {
    return;
  }
  if (UI.isDragging) {
    UI.isDragging = false;
    return;
  }
  const floor = getRaycastedIntersect("floor");
  if (floor) {
    Painter.draggingObject.parent.position.set(
      floor.point.x,
      THREE_CONSTS.CAT_HEIGHT / 1.5,
      floor.point.z
    );
  }
}
function onPointerUp(event) {
  Painter.mouse.x = event.clientX / window.innerWidth * 2 - 1;
  Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (Painter.mouse.x <= Painter.dragStart.x + 0.1 && Painter.mouse.x >= Painter.dragStart.x - 0.1 && Painter.mouse.y <= Painter.dragStart.y + 0.1 && Painter.mouse.y >= Painter.dragStart.y - 0.1)
    onPointerClick(event);
  if (!Painter.isDragging) return;
  const allyPlate = getRaycastedIntersect("allyPlate").object;
  if (allyPlate)
    Socket.sendMsg("reqPutCat", {
      uid: Painter.draggingObject.unit.uid,
      to: {
        x: allyPlate.boardCoords.x,
        y: allyPlate.boardCoords.y - 3
      }
    });
  cancelDragging();
}
function cancelDragging() {
  if (!Painter.isDragging) return;
  Painter.isDragging = false;
  Painter.drawUnit(Painter.draggingObject.unit, Painter.draggingObject.unit.y !== 3);
  Painter.draggingObject = null;
}
function onPointerClick(event) {
  Painter.mouse.x = event.clientX / window.innerWidth * 2 - 1;
  Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  const unitObject = getRaycastedUnitObject();
  if (unitObject) UI.showUnitInfo(unitObject.unit);
}
function onDragOver(event) {
  event.preventDefault();
}
function onDrop(event) {
  if (!UI.isDragging) return;
  Painter.mouse.x = event.clientX / window.innerWidth * 2 - 1;
  Painter.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  const unitObject = getRaycastedUnitObject();
  if (unitObject) {
    if (unitObject.unit.owner !== Player.player.id) return;
    Socket.sendMsg("reqGiveItem", {
      item: {
        x: parseInt(UI.draggingId.split("-")[2]),
        y: parseInt(UI.draggingId.split("-")[1])
      },
      uid: unitObject.unit.uid
    });
  }
  UI.isDragging = false;
}
function getRaycastedUnitObject() {
  Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
  const intersects = Painter.raycaster.intersectObjects(Painter.scene.children);
  for (let i = 0; i < intersects.length; ++i) {
    const object = intersects[i].object;
    if (object.parent.name === "unitBody") return object.parent;
  }
  return null;
}
function getRaycastedIntersect(name) {
  Painter.raycaster.setFromCamera(Painter.mouse, Painter.camera);
  const intersects = Painter.raycaster.intersectObjects(Painter.scene.children);
  for (let i = 0; i < intersects.length; ++i) {
    const object = intersects[i].object;
    if (object.name === name) return intersects[i];
  }
  return null;
}

// client/javascripts/main.js
window.onload = () => {
  init();
};
async function init() {
  fetchUserLog();
  await fetchResource();
  if (!isPlayableDevice()) {
    UI.init(false);
    return;
  }
  ;
  [UI, Socket, Painter].forEach((module) => {
    module.init();
  });
}
async function fetchResource() {
  await Unit.fetchData();
  await fetchImages();
  endLoading();
}
async function fetchImages() {
  const data = Object.values(Unit.CATS).concat(Object.values(Unit.CREEPS));
  let count = 0;
  startLoading();
  data.forEach((unit) => {
    const img = new Image();
    img.src = `/images/portraits/${unit.id}.jpg`;
    img.onload = () => {
      document.querySelector("#loadingText").innerHTML = `Fetching Data... ${count}/${data.length}`;
    };
    img.onerror = () => {
      console.log("Error fetching image.");
    };
  });
}
function startLoading() {
  document.querySelector("#loading").style.display = "flex";
}
function endLoading() {
  document.querySelector("#loading").style.display = "none";
}
function isPlayableDevice() {
  const agent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(agent);
  return !isMobile;
}
async function fetchUserLog() {
  console.log("Logging user info...", (/* @__PURE__ */ new Date()).toLocaleString());
  const browserInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language || navigator.userLanguage,
    createdAtLocale: (/* @__PURE__ */ new Date()).toLocaleString()
  };
  fetch("/user/log/browser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(browserInfo)
  }).then((res) => {
    if (res.status !== 200) {
      console.log("Failed to log user info.");
    } else {
      console.log("User info logged.");
    }
  }).catch((err) => {
    console.error(err);
  });
}
