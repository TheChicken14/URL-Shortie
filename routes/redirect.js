const express = require('express')
const router = express.Router()

const Url = require('../db/models/Url')
const Visit = require('../db/models/Visit')
const reservedUrls = require("../reservedUrls")
const useragent = require('express-useragent');

var path = require('path');

const isBot = require("isbot")

router.get('/:id', useragent.express(), async (req, res) => {
    if (reservedUrls.indexOf(req.params.id.toLowerCase()) !== -1 && process.env.NODE_ENV === 'production') {
        return res.sendFile(path.resolve("./build/index.html"))
    }
    const shortUrl = await Url.findOne({ shortCode: req.params.id })
    if (shortUrl) {
        res.redirect(shortUrl.longUrl)
        const isbot = isBot(req.get['user-agent'])
        console.log(req.useragent)
        new Visit({
            shortCode: shortUrl.shortCode,
            ip: req.ip,
            referrer: req.get("Referrer") || "Unknown",
            browser: !isbot && req.useragent.browser ? req.useragent.browser.toLowerCase() : "",
            os: !isbot && req.useragent.os ? req.useragent.os.toLowerCase() : "",
            isBot: isbot
        }).save()
    } else {
        res.status(404).json({
            message: "Not found!"
        })
    }
})

module.exports = {
    name: "Home",
    path: '/',
    router
}