let express = require("express");
const router = require("./routes/api");
const authRouter = require("./routes/auth");
let app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res, next) => res.render("page"));

app.use("/api", router);
app.use("/auth", authRouter);

console.log("ENV: ", process.env.NODE_ENV);

module.exports = app;
