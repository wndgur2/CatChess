let express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/api");
const authRouter = require("./routes/auth");
require("./db/mongoDB.js");
let app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client/public"));
app.set("view engine", "pug");
app.set("views", __dirname + "/../client/views");

const languageMiddleware = (req, res, next) => {
    const lang = req.headers["accept-language"];
    if (lang.includes("ko")) req.preferLanguage = "ko";
    else req.preferLanguage = "en";
    next();
};

// Register middleware globally
app.use(languageMiddleware);

app.get("/", (req, res, next) => {
    let lang = req.query.lang;
    if (lang != "ko") lang = "en";

    res.render("page", { language: lang });
});

app.use("/api", router);
app.use("/auth", authRouter);

console.log("ENV: ", process.env.NODE_ENV);

module.exports = app;
