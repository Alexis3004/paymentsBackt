const mongoose = require('mongoose');

const Banco = mongoose.model("Banco", {
    nombre: String,
    email: { type: String, unique: true },
    telefono: { type: Number, unique: true }
}, "bancos");

module.exports = Banco;