const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = require('../db/models/User')
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

    const isAdmin = allUsers.length == 0

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
                        expiresIn: '1h'
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

router.get("/firstLogin", async (req, res) => {
    const users = await User.find({})
    const firstLogin = users.length < 1
    res.json({
        firstLogin
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