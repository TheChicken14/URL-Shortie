const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortCode: { type: String, required: true },
    date: { type: Date, default: Date.now },
    ip: { type: String, required: true },
    referrer: { type: String, default: "" },
    browser: { type: String, default: "" },
    os: { type: String, default: "" },
    isBot: { type: Boolean, required: true }
});

module.exports = mongoose.model("click", urlSchema);