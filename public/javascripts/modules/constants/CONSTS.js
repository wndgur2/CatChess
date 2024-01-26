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
const CATCHESS_ID = "CATCHESS_ID";

const SYNERGIES = {
    Poeir: {
        desc: {
            3: "Poeir units gain 25% Attack Damage.",
            6: "Poeir units gain 50% Attack Damage.",
        },
    },
    Lumen: {
        desc: {
            2: "Lumen units gain 10% Attack Speed.",
            4: "Lumen units gain 25% Attack Speed.",
            6: "Lumen units gain 50% Attack Speed.",
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
    1: "#EEEEEE",
    2: "#55EE33",
    3: "#4488EE",
    4: "#CC21CC",
    5: "#EEEE42",
};

export { GAME_STATES, DRAGGING_TYPES, CATCHESS_ID, COST_COLORS, SYNERGIES };
