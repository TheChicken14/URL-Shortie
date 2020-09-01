const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = require('../db/models/User')
const InvalidToken = require("../db/models/InvalidToken")
const Url = require("../db/models/Url")
const secret = require("../config").secret
const withAuth = require('../middleware');

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const allUsers = await User.find({})
    if (allUsers.length > 0) {
        return res.status(401).json({
            error: 'User already created.'
        })
    }

    const isAdmin = allUsers.length === 0

    const user = new User({ email, password, admin: isAdmin });
    user.save(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send("Error registering new user please try again.");
        } else {
            res.json({
                email,
                success: true,
                message: "Successfully created account!"
            });
        }
    });
});

router.post('/authenticate', function (req, res) {
    const { email, password } = req.body;
    User.findOne({ email }, function (err, user) {
        if (err) {
            console.error(err);
            res.status(500)
                .json({
                    error: 'Internal error please try again'
                });
        } else if (!user) {
            res.status(401)
                .json({
                    error: 'Incorrect email or password'
                });
        } else {
            user.isCorrectPassword(password, function (err, same) {
                if (err) {
                    res.status(500)
                        .json({
                            error: 'Internal error please try again'
                        });
                } else if (!same) {
                    res.status(401)
                        .json({
                            error: 'Incorrect email or password'
                        });
                } else {
                    // Issue token
                    const payload = { email };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: '6h'
                    });
                    res.cookie('token', token, { httpOny: true });
                    res.json({
                        token
                    })
                }
            });
        }
    });
});

router.post("/logout", withAuth, async (req, res) => {
    try {
        const newInvalidToken = new InvalidToken({
            token: req.token
        })
        await newInvalidToken.save()
        res.json({
            message: "Successfully logged out.",
            success: true
        })
    } catch (e) {
        res.status(500).json({
            message: "An error occurred!"
        })
        console.error(e)
    }
})

router.get("/registrationStatus", async (req, res) => {
    const users = await User.find({})
    const firstLogin = users.length < 1
    res.json({
        registration: firstLogin,
    })
})

router.get("/details", withAuth, async (req, res) => {
    const UserData = await User.findOne({ email: req.email }).lean()
    delete UserData._id
    delete UserData.__v
    delete UserData.password
    res.json(UserData)
})

router.post("/update", withAuth, async (req, res) => {
    const UserData = await User.findOne({ email: req.email })
    const newSettings = req.body
    if (newSettings.email) {
        for (const objKey in newSettings) {
            if (UserData[objKey] !== newSettings[objKey]) UserData[objKey] = newSettings[objKey];
            else return;
        }
    }
    await User.updateOne(newSettings)
    res.json({
        email: newSettings.email,
        admin: newSettings.admin
    })
})

router.delete("/delete", withAuth, async (req, res) => {
    await User.deleteOne({ email: req.email })
    await Url.deleteMany({ email: req.email })
    res.json({
        message: "Account deleted.",
        sucess: true
    })
})

router.get("/checkToken", withAuth, (req, res) => {
    res.status(200).json({
        success: true
    })
})

module.exports = {
    name: "Authenticate",
    path: '/api/user',
    router
}