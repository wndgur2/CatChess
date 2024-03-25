const express = require("express");
const https = require("https");
require("dotenv").config();
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");

const router = express.Router();

const redirectUri =
    process.env.NODE_ENV === "production"
        ? "http://catchess.ap-northeast-2.elasticbeanstalk.com/auth/google/callback"
        : "http://localhost:8080/auth/google/callback";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
);
const scopes = ["https://www.googleapis.com/auth/userinfo.email"];

const authorizationUrl = oauth2Client.generateAuthUrl({
    scope: scopes,
    include_granted_scopes: true,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

router.get("/google", (req, res) => {
    res.redirect(authorizationUrl);
});

router.get("/google/callback", async (req, res) => {
    const code = req.query.code;
    let userInfo = {};
    oauth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error("Error exchanging code for tokens:", err.message);
            res.status(500).send("Error exchanging code for tokens");
        }
        try {
            oauth2Client.setCredentials(token);
            res.cookie("token", token);

            const tokenData = jwt.decode(token.id_token);
            userInfo.name = tokenData.name;
            userInfo.email = tokenData.email;
            res.cookie("name", userInfo.name);
            res.cookie("email", userInfo.email);

            //TODO : store/get user data from database
            res.cookie("record", "r");
        } catch (error) {
            console.error("Error exchanging code for token:", error.message);
        } finally {
            res.redirect("/");
        }
    });
});

module.exports = router;
