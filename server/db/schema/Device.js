const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const deviceSchema = new Schema({
    userAgent: { type: String, required: true },
    language: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    ip: { type: String, required: true },
});

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
