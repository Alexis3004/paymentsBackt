const Tienda = require("@models/Tienda");
const config = require("@config/app");

class TiendaController {
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
            const tiendas = await Tienda.find({}).exec()
            response.data = tiendas
            response.status = 200
            res.status(200).send(response)
        } catch(err) {
            if (response.errors.length === 0) {
                response.errors.push({
                    "msg": "Error interno del sistema al consultar las tiendas",
                    "param": '',
                    "location": "server"
                });
            }
            res.status(response.status).send(response);
        }
    }
}

module.exports = TiendaController;