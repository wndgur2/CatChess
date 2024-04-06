let express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const dataRouter = require("./routes/data");
const userRouter = require("./routes/user");
require("./db/mongoDB.js");
let app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/../client/public"));
app.set("view engine", "pug");
app.set("views", __dirname + "/../client/views");

const languageMiddleware = (req, res, next) => {
    let lang = req.headers["accept-language"];
    if (lang.includes("ko")) req.lang = "ko";
    else req.lang = "en";
    next();
};

// Register middleware globally
app.use(languageMiddleware);

app.get("/", (req, res, next) => {
    if (req.query.lang) req.lang = req.query.lang;
    res.cookie("lang", req.lang);
    res.render("page", { language: req.lang });
});

app.use("/data", dataRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

console.log("ENV: ", process.env.NODE_ENV);

module.exports = app;
