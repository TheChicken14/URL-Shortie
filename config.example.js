module.exports = {
    web: {
        port: 8888, // Port for server
    },
    db: {
        mongouri: '' // MongoDB URI
    },
    secret: 'your-secret', // Secret for JWT Token
    proxy: false, // Set to true if using URL-Shortie behind a proxy
    dev: false // Set to true if working with development env
}