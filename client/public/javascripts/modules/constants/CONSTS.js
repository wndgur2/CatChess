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

export { GAME_STATES, DRAGGING_TYPES, COST_COLORS, SYNERGIES };
