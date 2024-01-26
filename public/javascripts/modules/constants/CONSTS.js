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
        desc: "2: Poeir units gain 25% Attack Damage.\n4: Poeir units gain 50% Attack Damage.",
        color: "#FF0000",
    },
    Lumen: {
        desc: "Lumen units gain 10% Attack Speed.",
        color: "#00FF00",
    },
    Nature: {
        desc: "Nature units gain 10% Armor.",
        color: "#0000FF",
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
