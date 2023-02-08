const mongoose = require('mongoose');

const Tienda = mongoose.model("Tienda", {
    nombre: String,
    email: { type: String, unique: true },
    telefono: { type: Number, unique: true }
}, "tiendas");

module.exports = Tienda;