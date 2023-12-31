const Unit = require("./Unit");
const CREEPS = require("./constants/CREEPS.js");

class Creep extends Unit {
    static prototypes = CREEPS;

    constructor(id, x, y) {
        super(Creep.prototypes[id], "creep", x, y, 1);
    }
}

module.exports = Creep;
