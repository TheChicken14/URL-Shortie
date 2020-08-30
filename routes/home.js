const express = require('express')
const router = express.Router()

const url = require('../db/models/Url')

router.get('/', async (req, res) => {
    res.send("hi!")
})

module.exports = {
    name: "Home",
    path: '/',
    router
}