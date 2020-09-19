const express = require('express')
const router = express.Router()

const Url = require('../db/models/Url')
const shortid = require("shortid")
const Visit = require('../db/models/Visit')
const getWebsiteTitle = require("../functions/getWebsiteTitle")

const withAuth = require('../middleware');

const reservedUrls = require("../reservedUrls")

const urlRegex = require('url-regex');

router.post('/create', withAuth, async (req, res) => {
    const { url, id, title } = req.body;
    if (!url) {
        return res.status(401).json({
            error: 'No URL provided!'
        })
    } else if (!urlRegex({ exact: true, strict: false }).test(url)) {
        return res.status(400).json({
            error: 'Invalid URL Provided!'
        })
    }

    let shortCode = id ? id : shortid.generate()
    const defTitle = title || await getWebsiteTitle(url)

    if (reservedUrls.indexOf(shortCode) !== -1) {
        return res.status(401).json({
            message: 'URL Not allowed',
            type: 'urlNotAllowed'
        })
    }
    if (shortCode.length < 3 || shortCode.length > 31) {
        return res.status(400).json({
            message: 'Custom short URL must be between 3 and 30 characters',
            type: shortCode.length < 3 ? 'urlTooShort' : 'urlTooLong'
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

router.get("/stats/:id", async (req, res) => {
    const { id } = req.params
    const foundUrl = await Url.findOne({ shortCode: id })
    if (!foundUrl) {
        res.status(404).json({
            message: "URL not found!",
            type: "urlNotFound"
        })
        return;
    }
    const visits = await Visit.find({ shortCode: foundUrl.shortCode })
    if (!visits[0]) {
        res.json([])
    }
    // TODO: add link data instead of just an array of visits
    const formattedVisits = visits.map((visit) => ({
        shortCode: visit.shortCode,
        date: visit.date,
        referrer: visit.referrer,
        browser: visit.browser,
        os: visit.os,
        isBot: visit.isBot
    }))
    res.json(formattedVisits)
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