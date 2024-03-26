require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => {
    console.error("connection error:", error);
});

db.on("connected", () => {
    console.log("Connected to MongoDB");
});

module.exports = mongoose;
