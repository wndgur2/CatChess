const { TIME_STEP, STATUS } = require("./CONSTS");

const INFINITY = 30;
const TYPES = {
    cc: "cc",
    damage: "damage",
    heal: "heal",
};
const SKILLS = {
    roar: {
        id: "roar",
        name: "Roar",
        desc: "Stuns 3s enemies around.",
        mp: 30,
        active: true,
        execute: (cat) => {
            const DURATION = 1; // seconds
            const RANGE = 1;
            const TARGET_AMOUNT = INFINITY;

            cat.battleField
                .getNearestUnits(cat, RANGE, TARGET_AMOUNT, false)
                .forEach(({ _, target }) => {
                    target.status.push([
                        STATUS.STUNNED,
                        secondToTimeStep(DURATION),
                    ]);
                });
        },
    },
};

function secondToTimeStep(second) {
    return parseInt((second * 1000) / TIME_STEP);
}

module.exports = SKILLS;
