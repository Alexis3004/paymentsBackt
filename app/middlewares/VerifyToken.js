const { expressjwt: jwt } = require("express-jwt");
const config = require('@config/app');

module.exports =  jwt({
    secret: config.jwt.service_key,
    algorithms: ["HS256"],
    requestProperty: 'service'
})

// module.exports = jwt({
//     secret: config.jwt.service_key,
//     algorithms: ['HS256'],
//     requestProperty: 'service'
// })