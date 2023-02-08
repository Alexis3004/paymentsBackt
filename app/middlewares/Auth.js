const { expressjwt: jwt } = require('express-jwt');
const config = require('@config/app');
const UserController = require("@controllers/UserController");

const isRevokedCallback = async (req, token) => {
    try {
        console.log('token',token)
        const authorization = req.headers.authorization.split(' ')
        req.body.apiToken = {
            token: authorization[1],
            id: token.payload.userId
        }
        const valid = await UserController.getRevokedToken(token.payload, authorization[1]);
        return !valid
    } catch(error) {
        return true
    }
};

module.exports =  jwt({
    secret: config.jwt.service_key,
    algorithms: ["HS256"],
    isRevoked: isRevokedCallback
})