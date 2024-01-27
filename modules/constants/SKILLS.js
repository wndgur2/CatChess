const INFINITY = -1;
const TYPES = {
    cc: "cc",
    damage: "damage",
    heal: "heal",
};
const SKILLS = {
    roar: {
        id: "roar",
        name: "포효",
        desc: "주변의 적들을 1초간 기절시킵니다.",
        mp: 80,
        range: 1,
        active: true,
        targetAmount: INFINITY,
        type: TYPES.cc,
        subType: "stun",
        value: 1,
        execute: function () {
            console.log(this.name, "가 포효합니다.");
        },
    },
};

module.exports = SKILLS;
