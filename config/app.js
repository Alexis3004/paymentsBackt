require('dotenv').config()

module.exports = {
    server: process.env.APP_URL,
    ports: {
        http: process.env.APP_HTTP_PORT,
        https: process.env.APP_HTTPS_PORT
    },
};