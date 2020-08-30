const mongoose = require("mongoose");
const db = require("../config").db.mongouri

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        });
        console.log("[DB]: Connected to DB");
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = connectDB;