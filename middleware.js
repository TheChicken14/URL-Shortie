const jwt = require('jsonwebtoken');
const secret = require("./config").secret

const withAuth = function (req, res, next) {
    const token =
        req.body.token ||
        req.query.token ||
        req.cookies["token"] ||
        req.header('x-access-token') ||
        req.header('Authorization')

    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
}

module.exports = withAuth;