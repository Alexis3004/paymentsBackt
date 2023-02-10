const User = require("@models/User");
const Transaccion = require("@models/Transaccion");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("@config/app");

// Validator
const { body, check, validationResult } = require('express-validator');

class UserController {
    static getRevokedToken(user, token) {
        return new Promise(async (resolve, reject) => {
            try {
                const usuario = await User.findOne({ _id: user.userId });
                resolve(usuario.api_token == token);
            } catch (error) {
                console.log("Error al revocar el token");
                reject(false);
            }
        });
    }

    static async login(req, res) {
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
            await check('email').if((value, { req }) => !req.body.telefono).notEmpty().bail().isEmail().run(req);
            await check('telefono').if((value, { req }) => !req.body.email).notEmpty().run(req);
            await check('password').notEmpty().bail().isLength({ min: 4 }).run(req);

            const result = validationResult(req);
            if (!result.isEmpty()) {
                response.errors = result.array()
                response.status = 422;
                throw new Error("Errores de validación.");
            }

            const request = req.body;

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

            const match = await bcrypt.compare(request.password, user.password);

            if (!match) {
                response.errors.push({
                    "msg": "Contraseña incorrecta.",
                    "param": 'password',
                    "location": "database"
                });
                response.status = 422;
                throw new Error("Contraseña incorrecta.");
            }
            // console.log(user);
            if (user.api_token === "") {
                // console.log("generando token");
                const token = jwt.sign(
                    { userId: user._id },
                    config.jwt.service_key,
                    { expiresIn: 3200 }
                );
                user.api_token = token;
                await User.findByIdAndUpdate(user._id, { api_token: token });
                response.status = 200;
                response.data = {
                    type: "user",
                    attributes: user,
                };
                res.send(response);
            } else {
                // console.log("ya hay token");
                jwt.verify(
                    user.api_token,
                    config.jwt.service_key,
                    async (err, decoded) => {
                        if (err) {
                            // console.log("Token expirado");
                            const token = jwt.sign(
                                { userId: user._id },
                                config.jwt.service_key,
                                { expiresIn: 3200 }
                            );
                            user.api_token = token;
                            await User.findByIdAndUpdate(user._id, {
                                api_token: token,
                            });
                            response.status = 200;
                            response.data = {
                                type: "user",
                                attributes: user,
                            };
                            res.send(response);
                        } else {
                            // console.log("Token válido");
                            response.status = 200;
                            response.data = {
                                type: "user",
                                attributes: user,
                            };
                            res.send(response);
                        }
                    }
                );
            }
        } catch (error) {
            console.log(error);
            if (response.errors.length == 0) {
                response.errors.push({
                "msg": "Error interno del sistema",
                "param": '',
                "location": "server"
            });
            }
            res.status(response.status).send(response);
        }
    }

    static async actualizarToken(req, res) {
        // console.log(req.body);
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
            const { apiToken } = req.body;
            const token = jwt.sign(
                { userId: apiToken.id },
                config.jwt.service_key,
                { expiresIn: 3200 }
            );
            await User.findByIdAndUpdate(apiToken.id, { api_token: token });
            response.status = 200
            response.data = {
                type: "token",
                attributes: {
                    token
                }
            }
            res.send(response);
        } catch (error) {
            // console.log(error);
            response.errors.push({
                "msg": "Error interno del sistema",
                "param": '',
                "location": "server"
            });
            res.status(response.status).send(response);
        }
    }

    static async register(req, res) {
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
            await check('identificacion').notEmpty().bail().custom((value, { req }) => Number(value) !== NaN).run(req);
            await check('email').notEmpty().bail().isEmail().run(req);
            await check('telefono').notEmpty().bail().custom((value, { req }) => Number(value) !== NaN).run(req);
            await check('pin').notEmpty().bail().custom((value, { req }) => Number(value) !== NaN).bail().isLength({ min: 6, max: 6 }).run(req);
            await check('password').notEmpty().bail().isLength({ min: 4 }).run(req);

            const result = validationResult(req);
            if (!result.isEmpty()) {
                response.errors = result.array()
                response.status = 422;
                throw new Error("Errores de validación.");
            }

            const request = req.body;
            const hashPassword = await bcrypt.hash(request.password.trim(), 10);

            let user = new User()
            user.identificacion = Number(request.identificacion)
            user.nombre = request.nombre || ''
            user.apellido = request.apellido || ''
            user.email = request.email
            user.telefono = Number(request.telefono)
            user.pin = Number(request.pin)
            user.password = hashPassword
            user = await user.save();

            const token = jwt.sign(
                { userId: user._id },
                config.jwt.service_key,
                { expiresIn: 3200 }
            );
            user.api_token = token;
            user = await user.save();
            // await User.findByIdAndUpdate(user._id, { api_token: token });
            response.status = 201;
            response.data = {
                type: "user",
                attributes: user,
            };
            res.status(response.status).send(response);
        } catch (error) {
            if ( typeof error == 'object' && Object.keys(error).includes('code') && Object.keys(error).includes('keyPattern')) {
                if (error.code == 11000) {
                    response.status = 422;
                    response.errors.push({
                        "msg": "Campo duplicado",
                        "param": Object.keys(error.keyPattern)[0],
                        "location": "body"
                    });
                    res.status(response.status).send(response);
                    return 'OK'
                }
            }
            response.errors.push({
                "msg": "Error interno del sistema",
                "param": '',
                "location": "server"
            });
            res.status(response.status).send(response);
        }
    }

    static async logout(req, res) {
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
            const request = req.body;

            const user = await User.findOne({ _id: request.apiToken.id });
            user.api_token = ''
            await user.save();

            response.status = 201;
            res.status(response.status).send(response);
        } catch (error) {
            console.log(error)
            response.errors.push({
                "msg": "Error interno del sistema",
                "param": '',
                "location": "server"
            });
            res.status(response.status).send(response);
        }
    }

    static async update(req, res) {
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
            const request = req.body;
            if (req.params.id !== request.apiToken.id) {
                res.status(403).send('Forbidden...');
                return 'OK'
            }
            await check('identificacion').notEmpty().bail().custom((value, { req }) => Number(value) !== NaN).run(req);
            await check('email').notEmpty().bail().isEmail().run(req);
            await check('telefono').notEmpty().bail().custom((value, { req }) => Number(value) !== NaN).run(req);

            const result = validationResult(req);
            if (!result.isEmpty()) {
                response.errors = result.array()
                response.status = 422;
                throw new Error("Errores de validación.");
            }

            let user = await User.findOne({ _id: request.apiToken.id });
            user.identificacion = Number(request.identificacion)
            user.nombre = request.nombre || ''
            user.apellido = request.apellido || ''
            user.email = request.email
            user.telefono = Number(request.telefono)
            user = await user.save();

            response.status = 201;
            response.data = {
                type: "user",
                attributes: user,
            };
            res.status(response.status).send(response);
        } catch (error) {
            console.log(error)
            if ( typeof error == 'object' && Object.keys(error).includes('code') && Object.keys(error).includes('keyPattern')) {
                if (error.code == 11000) {
                    response.status = 422;
                    response.errors.push({
                        "msg": "Campo duplicado",
                        "param": Object.keys(error.keyPattern)[0],
                        "location": "body"
                    });
                    res.status(response.status).send(response);
                    return 'OK'
                }
            }
            response.errors.push({
                "msg": "Error interno del sistema",
                "param": '',
                "location": "server"
            });
            res.status(response.status).send(response);
        }
    }

    static async updatePin(req, res) {
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
            const request = req.body;
            if (req.params.id !== request.apiToken.id) {
                res.status(403).send('Forbidden...');
                return 'OK'
            }
            await check('pin').notEmpty().bail().custom((value, { req }) => Number(value) !== NaN).bail().isLength({ min: 6, max: 6 }).run(req);

            const result = validationResult(req);
            if (!result.isEmpty()) {
                response.errors = result.array()
                response.status = 422;
                throw new Error("Errores de validación.");
            }

            let user = await User.findOne({ _id: request.apiToken.id });
            user.pin = Number(request.pin)
            // todo falta validar que no esté enviando el mismo pin
            user.intentos = 0
            user = await user.save();

            response.status = 201;
            response.data = {
                type: "user",
                attributes: user,
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

    static async consultarSaldo(req, res) {
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
            const request = req.body;
            var transacciones = await Transaccion.find({ $or:[ {destinatario: request.apiToken.id}, {remitente: request.apiToken.id} ]}, 'tipo valor remitente destinatario').exec()
            console.log('transacciones',transacciones)
            let saldo = 0
            if (transacciones.length > 0) {
                const gastos = transacciones.filter(item => item.remitente == request.apiToken.id).reduce((prev, current) => prev + current.valor, 0)
                const ingresos = transacciones.filter(item => item.destinatario == request.apiToken.id).reduce((prev, current) => prev + current.valor, 0)
                saldo = ingresos - gastos
            }
            response.data = {
                type: 'Saldo',
                value: saldo
            }
            response.status = 200
            res.status(200).send(response)
        } catch(err) {
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

    static async consultarMovimientos(req, res) {
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
            const request = req.body;
            const transacciones = await Transaccion.find({ $or:[ {destinatario: request.apiToken.id}, {remitente: request.apiToken.id} ]}).sort({fecha: 'desc'}).exec()
            response.data = transacciones
            response.status = 200
            res.status(200).send(response)
        } catch(err) {
            if (response.errors.length === 0) {
                response.errors.push({
                    "msg": "Error interno del sistema al consultar las transacciones",
                    "param": '',
                    "location": "server"
                });
            }
            res.status(response.status).send(response);
        }
    }
}

module.exports = UserController;