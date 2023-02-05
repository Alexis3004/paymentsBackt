require('module-alias/register')
//Routes
const routes = require('@routes/api')

const express = require('express')
const http = require('http')
const https = require('https')
const cors = require('cors')

const fs = require('fs')
const path = require('path')

class Server {
    configCors = {
        origin: '*'
    }

    constructor() {
        this.app = express()

        // let privateKey  = fs.readFileSync(path.join(__dirname, '../ssl/server.key'), 'utf8')
        // let certificate = fs.readFileSync(path.join(__dirname, '../ssl/server.crt'), 'utf8')
        // let options = {
        //     key: privateKey,
        //     cert: certificate
        // }

        this.https = https.createServer(this.app);
        // this.https = https.createServer(options, this.app);

        this.http = http.createServer(this.app)

        this.app.use(cors(this.configCors))

        this.app.use('/', routes);
    }

    httpListen (port) {
        this.http.listen(port, () => {
            console.log('Server HTTP ON');
        });
    }

    httpsListen (port) {
        this.https.listen(port, () => {
            console.log('Server HTTPS ON');
        });
    }
}

module.exports = Server