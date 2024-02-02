const Unit = require("./Unit");
const CREEPS = require("../constants/CREEPS.js");

class Creep extends Unit {
    static prototypes = CREEPS;

    constructor(id, pid) {
        super(Creep.prototypes[id], pid, 0, 0, 1);
    }
}

module.exports = Creep;
