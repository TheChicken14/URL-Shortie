const mongoose = require("mongoose");

const invalidTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '6h' },
    },
});

module.exports = mongoose.model("invalidToken", invalidTokenSchema);