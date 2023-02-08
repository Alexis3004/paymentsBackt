const mongoose = require('mongoose');

const Transaccion = mongoose.model("Transaccion", {
    tipo: String,
    valor: Number,
    fecha: { type: Date, default: Date.now },
    remitente: String,
    destinatario: String,
    tienda: String,
    banco: String
}, "transacciones");

module.exports = Transaccion;