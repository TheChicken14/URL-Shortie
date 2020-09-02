const config = require("./config")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const fs = require("fs")
const path = require("path")

const packageJson = require("./package.json")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
// Disable "x-powered-by" header
app.use((req, res, next) => {
    res.setHeader("X-Powered-By", `URL-Shortie v${packageJson.version}`);
    next()
})

if (config.proxy) {
    app.set("trust proxy", true)
}

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
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname + '/build/index.html'));
        });
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