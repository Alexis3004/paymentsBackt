const Transaccion = require("@models/Transaccion");
const User = require("@models/User");
const config = require("@config/app");

// Validator
// const { body, check, validationResult } = require('express-validator');

class TransaccionController {
    static async recargar(req, res) {
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
            const request = req.body;//request.apiToken.id

            // await check('pin').notEmpty().bail().custom((value, { req }) => Number(value) !== NaN).bail().isLength({ min: 6, max: 6 }).run(req);
            // await check('telefono').if((value, { req }) => !req.body.email).notEmpty().run(req);
            // await check('password').notEmpty().bail().isLength({ min: 4 }).run(req);

            // const result = validationResult(req);
            // if (!result.isEmpty()) {
            //     response.errors = result.array()
            //     response.status = 422;
            //     throw new Error("Errores de validación.");
            // }

            let user = null;
            if (request.email && request.email.trim() != "") {
                user = await User.findOne({ email: request.email.trim() });
            } else if (request.telefono && request.telefono != "") {
                user = await User.findOne({
                    telefono: request.telefono,
                });
            }

            if (user === null) {
                response.errors.push({
                    "msg": "Usuario no encontrado.",
                    "param": '',
                    "location": "database"
                });
                response.status = 422;
                throw new Error("Usuario no encontrado en base de datos.");
            }

            if (user.intentos > 2) {
                response.errors.push({
                    "msg": "Pin bloqueado, debe cambiarlo.",
                    "param": 'intentos',
                    "location": "body"
                });
                response.status = 422;
                throw new Error("Pin bloqueado, debe cambiarlo.");
            }

            if (user.pin != request.pin) {
                user.intentos = user.intentos + 1
                await user.save()

                response.errors.push({
                    "msg": "Pin incorrecto.",
                    "param": 'pin',
                    "location": "body"
                });
                response.status = 422;
                throw new Error("Pin incorrecto.");
            }

            let transaccion = Transaccion()
            transaccion.tipo = 'Recarga bancaria'
            transaccion.valor = request.valor
            transaccion.destinatario = request.apiToken.id
            transaccion.remitente = ''
            transaccion.tienda = ''
            transaccion.banco = ''
            transaccion.banco = request.banco
            transaccion = await transaccion.save()
            response.status = 201;
            response.data = {
                type: "transaccion",
                attributes: transaccion,
            };
            res.status(response.status).send(response);
        } catch (error) {
            console.log(error)
            if (response.errors.length === 0) {
                response.errors.push({
                    "msg": "Error interno del sistema",
                    "param": '',
                    "location": "server"
                });
            }
            res.status(response.status).send(response);
        }
    }
}

module.exports = TransaccionController;