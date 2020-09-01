const jwt = require('jsonwebtoken');
const secret = require("./config").secret
const InvalidToken = require("./db/models/InvalidToken")
const User = require("./db/models/User")

const withAuth = async function (req, res, next) {
    const token =
        req.body.token ||
        req.query.token ||
        req.cookies["token"] ||
        req.header('x-access-token') ||
        req.header('Authorization')

    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        const isTokenInvalid = await InvalidToken.findOne({ token })
        if (isTokenInvalid) {
            return res.status(403).send('Unauthorized: Invalid token');
        }
        jwt.verify(token, secret, async function (err, decoded) {
            if (err) {
                res.status(403).send('Unauthorized: Invalid token');
            } else {
                // Look in the DB for the user
                const foundUser = await User.findOne({ email: decoded.email })
                // If user is not found, send a 403 status code.
                if (!foundUser) {
                    res.status(403).send('Unauthorized: Invalid token');
                } else {
                    req.email = decoded.email;
                    req.token = token
                    next();
                }
            }
        });
    }
}

module.exports = withAuth;