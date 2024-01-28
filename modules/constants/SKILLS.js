const Modifier = require("../unit/Modifier");
const { TIME_STEP } = require("./CONSTS");

const INFINITY = 30;
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
                    target.modifiers.push(
                        new Modifier(
                            { speedRatio: 0 },
                            secondToTimeStep(DURATION)
                        )
                    );
                });
        },
    },
};

function secondToTimeStep(second) {
    return parseInt((second * 1000) / TIME_STEP);
}

module.exports = SKILLS;
