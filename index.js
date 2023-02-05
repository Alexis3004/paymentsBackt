require('module-alias/register')

const config = require('@config/app')
const Server = require('@plugins/server')

const server = new Server()

server.httpListen(config.ports.http)