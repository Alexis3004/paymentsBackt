const Banco = require("@models/Banco");
const config = require("@config/app");

class BancoController {
    static async index(req, res) {
        const response = {
            data: [],
            errors: [],
            meta: {},
            links: {
                api: config.server,
            },
            status: 500,
        };
        try {
            const bancos = await Banco.find({}).exec()
            response.data = bancos
            response.status = 200
            res.status(200).send(response)
        } catch(err) {
            console.log('error banco', err)
            if (response.errors.length === 0) {
                response.errors.push({
                    "msg": "Error interno del sistema al consultar los bancos",
                    "param": '',
                    "location": "server"
                });
            }
            res.status(response.status).send(response);
        }
    }
}

module.exports = BancoController;