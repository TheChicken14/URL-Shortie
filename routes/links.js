const express = require('express')
const router = express.Router()

const Url = require('../db/models/Url')
const shortid = require("shortid")

const getWebsiteTitle = require("../functions/getWebsiteTitle")

const withAuth = require('../middleware');

router.post('/create', withAuth, async (req, res) => {
    const { url, id, title } = req.body;
    if (!url) {
        return res.status(401).json({
            error: 'No URL provided!'
        })
    }

    const foundUrl = await Url.findOne({ longUrl: url }).lean()
    if (foundUrl) {
        delete foundUrl._id
        delete foundUrl.__v
        res.json(foundUrl)
    }

    const shortCode = id || shortid.generate()
    const defTitle = title || await getWebsiteTitle(url)

    const newShortUrl = new Url({
        shortCode,
        longUrl: url,
        title: defTitle,
        createdBy: req.email,
        clickCount: 0
    })
    await newShortUrl.save()
    res.json({
        shortCode,
        longUrl: url,
        title: defTitle,
        createdBy: req.email,
        clickCount: 0
    })
})

router.delete("/delete", withAuth, async (req, res) => {
    const id = req.body.id || req.query.id;
    if (!id) {
        return res.status(400).json({
            message: 'No ID provided.'
        })
    }
    const foundUrl = await Url.findOne({ shortCode: id })
    if (foundUrl) {
        await foundUrl.remove()
        res.json({
            message: "URL Deleted.",
            success: true
        })
    } else {
        res.status(404).json({
            message: "URL not found."
        })
    }
})

router.get("/all", withAuth, async (req, res) => {
    const allLinks = await Url.find({}).lean()
    if (allLinks.length < 1) {
        return res.json([])
    }
    const formattedLinks = allLinks.map(l => ({
        shortCode: l.shortCode,
        longUrl: l.longUrl,
        title: l.title,
        createdBy: l.createdBy,
        clickCount: l.clickCount
    }))
    res.json(formattedLinks)
})

module.exports = {
    name: "Links",
    path: '/api/links',
    router
}