require('module-alias/register')

//inicializando Mongo
require('@plugins/conecction')

const config = require('@config/app')
const Server = require('@plugins/server')

//inicializando server
const server = new Server()

server.httpListen(config.ports.http)