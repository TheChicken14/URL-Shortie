const config = require("./config")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const fs = require("fs")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const connectDB = require('./db/index')
connectDB()

const routes = require("./routes")

routes.forEach(r => {
    console.log(`[ROUTER] Loading ${r.name}`)
    app.use(r.path, r.router)
})

if (!config.dev || process.argv[2] === "-prod") {
    process.env.NODE_ENV = "production"
    if (fs.existsSync("./build")) {
        app.use(express.static('./build'))
    } else {
        console.warn("[WARNING] You don't have the frontend built. API Only mode is now active.")
    }
}

app.listen(config.web.port, () => {
    console.log(`App started. Listening on port ${config.web.port}`)
    if (!config.dev || process.argv[2] === "-prod") {
        console.log("Running in production mode!")
    }
})