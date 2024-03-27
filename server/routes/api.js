const express = require("express");
const router = express.Router();
const mongoDB = require("../db/mongoDB");

router.get("/cats", (req, res, next) => {
    res.json(require("../modules/constants/cats.json"));
});
router.get("/creeps", (req, res, next) => {
    res.json(require("../modules/constants/creeps.json"));
});
router.get("/init", (req, res, next) => {
    res.send(req.ip);
});
router.post("/log/browser", (req, res, next) => {
    console.log("Browser info:", req.body);
    res.send("success");
});

// seperate db apis
router.get("/user/init", async (req, res, next) => {
    const email = req.query.email;
    const user = await initUser(email);
    res.json(user);
});

async function initUser(email) {
    const User = mongoDB.model("User");
    let user = await User.findOne({
        email: email,
    });
    if (!user) {
        const newUser = new User({
            email: email,
        });
        await newUser.save();
        user = newUser;
    }
    return user;
}
module.exports = router;
