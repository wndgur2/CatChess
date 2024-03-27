require("dotenv").config();
const mongoose = require("mongoose");
require("./schema/User");

mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
db.on("error", (error) => {
    console.error("connection error:", error);
});

db.on("connected", () => {
    console.log("Connected to MongoDB");
});

module.exports = mongoose;
