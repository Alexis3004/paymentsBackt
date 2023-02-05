require('dotenv').config()

module.exports = {
    server: process.env.APP_URL,
    ports: {
        http: process.env.PORT || 3000,
    },
};