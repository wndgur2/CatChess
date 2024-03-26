const express = require("express");
const router = express.Router();

router.get("/cats", (req, res, next) => {
    res.json(require("../modules/constants/cats.json"));
});
router.get("/creeps", (req, res, next) => {
    res.json(require("../modules/constants/creeps.json"));
});

module.exports = router;
