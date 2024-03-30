const express = require("express");
const router = express.Router();
const mongoDB = require("../db/mongoDB");
const jwt = require("jsonwebtoken");

router.get("/cats", (req, res, next) => {
    res.json(require("../modules/constants/cats.json"));
});
router.get("/creeps", (req, res, next) => {
    res.json(require("../modules/constants/creeps.json"));
});
router.post("/log/browser", (req, res, next) => {
    const device = req.body;
    device.ip = req.ip;
    const Device = mongoDB.model("Device");
    const newDevice = new Device(device);
    newDevice.save();

    res.sendStatus(200);
});

// db apis
router.get("/user/init", async (req, res, next) => {
    const id_token = req.headers.authorization
        .split('"id_token":"')[1]
        .split('"')[0];
    const email = jwt.decode(id_token).email;
    console.log(email);
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

router.put("/user/win", async (req, res, next) => {
    const id_token = req.headers.authorization
        .split('"id_token":"')[1]
        .split('"')[0];
    const email = jwt.decode(id_token).email;
    const user = await updateUser(email, "win");
    res.json(user);
});

router.put("/user/lose", async (req, res, next) => {
    const id_token = req.headers.authorization
        .split('"id_token":"')[1]
        .split('"')[0];
    const email = jwt.decode(id_token).email;
    const user = await updateUser(email, "lose");
    res.json(user);
});

async function updateUser(email, result) {
    const User = mongoDB.model("User");
    let user = await User.findOne({
        email: email,
    });
    if (result === "win") {
        user.win++;
    } else {
        user.loss++;
    }
    await user.save();
    return user;
}

module.exports = router;
