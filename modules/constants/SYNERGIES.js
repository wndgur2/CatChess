const SYNERGIES = {
    Poeir: {
        3: {
            desc: "Poeir units gain 25% Attack Damage.",
        },
        6: {
            desc: "Poeir units gain 50% Attack Damage.",
        },
        apply: (unit, amount) => {
            if (amount < 3) return;
            else if (amount < 6) unit.ad *= 1.25;
            else if (amount >= 6) unit.ad *= 1.5;
        },
    },
    Lumen: {
        2: {
            desc: "Lumen units gain 10% Attack Speed.",
        },
        4: {
            desc: "Lumen units gain 25% Attack Speed.",
        },
        6: {
            desc: "Lumen units gain 50% Attack Speed.",
        },
        apply: (unit, amount) => {
            if (amount < 2) return;
            else if (amount < 4) unit.speed *= 1.1;
            else if (amount < 6) unit.speed *= 1.25;
            else if (amount >= 6) unit.speed *= 1.5;
        },
    },
    Nature: {
        2: {
            desc: "Nature units gain 10% Armor.",
        },
        4: {
            desc: "Nature units gain 25% Armor.",
        },
        6: {
            desc: "Nature units gain 50% Armor.",
        },
        apply: (unit, amount) => {
            if (amount < 2) return;
            else if (amount < 4) unit.armor *= 1.1;
            else if (amount < 6) unit.armor *= 1.25;
            else if (amount >= 6) unit.armor *= 1.5;
        },
    },
};

module.exports = SYNERGIES;
