const mongoose = require('mongoose');

const User = mongoose.model('user', {
    correo: String,
    contrasena: String,
    salt: String,
    });

module.exports = User;