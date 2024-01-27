const SKILLS = {
    roar: {
        id: "roar",
        name: "포효",
        desc: "주변의 적들을 1초간 기절시킵니다.",
        mp: 20,
        execute: function () {
            console.log(this.name, "가 포효합니다.");
        },
    },
};

module.exports = SKILLS;
