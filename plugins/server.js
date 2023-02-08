require('module-alias/register')
//Routes
const routes = require('@routes/api')

const express = require('express')
const http = require('http')
// const https = require('https')
const cors = require('cors')

class Server {
    configCors = {
        origin: '*'
    }

    constructor() {
        this.app = express()

        this.http = http.createServer(this.app)

        this.app.use(cors(this.configCors))
        this.app.use(express.json());

        this.app.use('/', routes);
    }

    httpListen (port) {
        this.http.listen(port, () => {
            console.log('Server HTTP ON');
        });
    }
}

module.exports = Server