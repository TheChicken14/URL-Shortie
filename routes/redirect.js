const express = require('express')
const router = express.Router()

const Url = require('../db/models/Url')

router.get('/:id', async (req, res) => {
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
    path: '/s/',
    router
}