const config = require("./config")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');

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

app.listen(config.web.port, () => console.log(`App started. Listening on port ${config.web.port}`))