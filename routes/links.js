const express = require('express')
const router = express.Router()

const Url = require('../db/models/Url')
const shortid = require("shortid")

const getWebsiteTitle = require("../functions/getWebsiteTitle")

const withAuth = require('../middleware');

// eslint-disable-next-line no-useless-escape
const UrlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

const reservedUrls = require("../reservedUrls")

router.post('/create', withAuth, async (req, res) => {
    const { url, id, title } = req.body;
    if (!url) {
        return res.status(401).json({
            error: 'No URL provided!'
        })
    } else if (!UrlRegex.test(url)) {
        return res.status(400).json({
            error: 'Invalid URL Provided!'
        })
    }

    let shortCode = id ? id.toLowerCase() : shortid.generate()
    const defTitle = title || await getWebsiteTitle(url)

    if (reservedUrls.indexOf(shortCode) !== -1) {
        return res.status(401).json({
            message: 'URL Not allowed',
            type: 'urlNotAllowed'
        })
    }
    if (shortCode.length < 5 || shortCode.length > 31) {
        return res.status(400).json({
            message: 'Custom short URL must be between 5 and 30 characters',
            type: shortCode.length < 5 ? 'urlTooShort' : 'urlTooLong'
        })
    }
    shortCode = shortCode.trim().replace(/\s+/g, "-")

    const doesIdExist = await Url.findOne({ shortCode })
    if (doesIdExist) {
        return res.status(400).json({
            message: 'Short URL exists.',
            type: 'urlAlreadyExists'
        })
    }

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