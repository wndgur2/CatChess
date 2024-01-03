const GAME_STATES = {
    ARRANGE: "arrange",
    BATTLE: "battle",
    READY: "ready",
    FINISH: "finish",
};
Object.freeze(GAME_STATES);

const DRAGGING_OBJECTS = {
    ITEM: "item",
    UNIT: "unit",
};

export { GAME_STATES, DRAGGING_OBJECTS };
