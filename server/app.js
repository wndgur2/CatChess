let express = require("express");
const router = require("./routes/api");
const authRouter = require("./routes/auth");
require("./db/mongoDB.js");
let app = express();

app.use(express.static(__dirname + "/../client/public"));

app.set("view engine", "pug");
app.set("views", __dirname + "/../client/views");

app.get("/", (req, res, next) => res.render("page"));

app.use("/api", router);
app.use("/auth", authRouter);

console.log("ENV: ", process.env.NODE_ENV);

module.exports = app;
