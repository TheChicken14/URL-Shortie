const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortCode: { type: String, require: true },
    longUrl: { type: String, require: true },
    title: { type: String, require: true },
    createdBy: { type: String, require: true },
    clickCount: { type: Number, require: true },
});

module.exports = mongoose.model("url", urlSchema);