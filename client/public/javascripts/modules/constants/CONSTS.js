const GAME_STATES = {
    ARRANGE: "arrange",
    BATTLE: "battle",
    READY: "ready",
    FINISH: "finish",
};
const DRAGGING_TYPES = {
    ITEM: "item",
    UNIT: "unit",
};

const SYNERGIES = {
    Poeir: {
        desc: {
            3: "Poeir units gain 25% Attack Damage.",
            6: "Poeir units gain 50% Attack Damage.",
        },
    },
    Therme: {
        desc: {
            2: "Therme units gain 10% Attack Speed.",
            4: "Therme units gain 25% Attack Speed.",
            6: "Therme units gain 50% Attack Speed.",
        },
    },
    Nature: {
        desc: {
            2: "Nature units gain 10% Armor.",
            4: "Nature units gain 25% Armor.",
            6: "Nature units gain 50% Armor.",
        },
    },
};

const COST_COLORS = {
    1: "#cccccc",
    2: "#33bb11",
    3: "#3366ee",
    4: "#af11af",
    5: "#cccc21",
};

const CAT_PARTS = {
    head: {
        width: 0.8,
        height: 0.8,
        depth: 0.9,
        position: { x: 0, y: 0.8, z: 1.2 },
        rotation: { x: 0, y: 0, z: 0 },
    },
    body: {
        width: 1,
        height: 1,
        depth: 2.2,
        position: { x: 0, y: 0.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
    },
    leg1: {
        width: 0.4,
        height: 1.2,
        depth: 0.4,
        position: { x: 0.3, y: 0, z: 0.8 },
        rotation: { x: 0, y: 0, z: 0 },
    },
    leg2: {
        width: 0.4,
        height: 1.2,
        depth: 0.4,
        position: { x: -0.3, y: 0, z: 0.8 },
        rotation: { x: 0, y: 0, z: 0 },
    },
    leg3: {
        width: 0.4,
        height: 1.2,
        depth: 0.4,
        position: { x: 0.3, y: 0, z: -0.8 },
        rotation: { x: 0, y: 0, z: 0 },
    },
    leg4: {
        width: 0.4,
        height: 1.2,
        depth: 0.4,
        position: { x: -0.3, y: 0, z: -0.8 },
        rotation: { x: 0, y: 0, z: 0 },
    },
    tail: {
        width: 0.2,
        height: 1,
        depth: 0.2,
        position: { x: 0, y: 0.5, z: -1.3 },
        rotation: { x: Math.PI / 4, y: 0, z: 0 },
    },
};

export { GAME_STATES, DRAGGING_TYPES, COST_COLORS, SYNERGIES, CAT_PARTS };
