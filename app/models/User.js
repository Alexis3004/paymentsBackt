const mongoose = require('mongoose');

const User = mongoose.model("User", {
    identificacion: Number,
    nombre: String,
    apellido: String,
    email: { type: String, unique: true },
    telefono: { type: Number, unique: true },
    pin: Number,
    password: String,
    api_token: String,
    intentos: { type: Number, default: 0 }
}, "users");

module.exports = User;
