let express = require("express");
let app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.get("/", (req, res, next) => res.render("index"));

module.exports = app;
