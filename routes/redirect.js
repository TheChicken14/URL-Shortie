const express = require('express')
const router = express.Router()

const Url = require('../db/models/Url')

const reservedUrls = require("../reservedUrls")

var path = require('path');

router.get('/:id', async (req, res) => {
    if (reservedUrls.indexOf(req.params.id.toLowerCase()) !== -1 && process.env.NODE_ENV === 'production') {
        return res.sendFile(path.resolve("./build/index.html"))
    }
    const shortUrl = await Url.findOne({ shortCode: req.params.id })
    if (shortUrl) {
        res.redirect(shortUrl.longUrl)
        shortUrl.clickCount++
        await shortUrl.save()
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