module.exports = {
    web: {
        port: 8888, // Port for server
    },
    db: {
        mongouri: `mongodb://localhost:27017/urlshortener` // MongoDB URI
    },
    secret: 'your-secret' // Secret for JWT Token
}