const jwt = require('jsonwebtoken');
const secret = require("./config").secret
const InvalidToken = require("./db/models/InvalidToken")

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
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(403).send('Unauthorized: Invalid token');
            } else {
                req.email = decoded.email;
                req.token = token
                next();
            }
        });
    }
}

module.exports = withAuth;