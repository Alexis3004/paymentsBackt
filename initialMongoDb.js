require('module-alias/register')

const config = require('@config/app');
const moongose = require("mongoose");

const User = require('@models/User')
const Banco = require('@models/Banco')
const Tienda = require('@models/Tienda')

//configuracion conexion
moongose.set('strictQuery', true);

moongose.connect(config.mongo.url, null, (err) => {
    if (err)
        console.log(err)
    else
        console.log("=> Connect with mongondb")
});

const InitialUsers = [
    {
        identificacion: 1098818855,
        nombre: "Alexis",
        apellido: "Cáceres",
        email: "a1098818855@gmail.com",
        telefono: 3232335276,
        pin: 123456,
        password: "$2b$10$A5IhUIdrAc65nxOgYSBPf.0SklcIWsA.BEQitwuVjStbrXMvnpwLG",//"Alex3208",
        api_token: ""
    },
    {
        identificacion: 1098822730,
        nombre: "Jenny",
        apellido: "Santamaría",
        email: "jmsr06@gmail.com",
        telefono: 3204877763,
        pin: 123456,
        password: "$2b$10$Zsa2N5twYKjB8U.9HcK29OxnG.zgrjzCz.Sq1TMkmMtfsENeHJT9.",//jmsr06
        api_token: ""
    },
]

const InitialBancos = [
    {
        nombre: 'Bancolombia',
        email: 'bancolombia@bancolombia.com',
        telefono: 1234567890
    },
    {
        nombre: 'Davivienda',
        email: 'davivienda@davivienda.com',
        telefono: 1234567891
    },
    {
        nombre: 'Agrario',
        email: 'agrario@agrario.com',
        telefono: 1234567892
    },
    {
        nombre: 'BBVA',
        email: 'bbva@bbva.com',
        telefono: 1234567893
    },
    {
        nombre: 'Occidente',
        email: 'occidente@occidente.com',
        telefono: 1234567894
    }
]

const InitialTiendas = [
    {
        nombre: 'Falabella',
        email: 'falabella@falabella.com',
        telefono: 1234567890
    },
    {
        nombre: 'Exito',
        email: 'exito@exito.com',
        telefono: 1234567891
    },
    {
        nombre: 'Jumbo',
        email: 'jumbo@jumbo.com',
        telefono: 1234567892
    },
    {
        nombre: 'Home Center',
        email: 'homecenter@homecenter.com',
        telefono: 1234567893
    },
    {
        nombre: 'Makro',
        email: 'makro@makro.com',
        telefono: 1234567894
    }
]
//insertar datos iniciales y crear coleccion
const PUser = User.insertMany(InitialUsers).then((res) => {
    console.log("=> Insercion de los usuarios completa")
    // moongose.connection.close();
}).catch((err) => console.log(err));

const PBanco = Banco.insertMany(InitialBancos).then((res) => {
    console.log("=> Insercion de los bancos completa")
    // moongose.connection.close();
}).catch((err) => console.log(err));

const PTienda = Tienda.insertMany(InitialTiendas).then((res) => {
    console.log("=> Insercion de las tiendas completa")
    // moongose.connection.close();
}).catch((err) => console.log(err));

Promise.all([PUser,PBanco,PTienda]).then((res) => {
    console.log('Se ejecutaron todas las promesas')
    moongose.connection.close();
}). catch((err) => {
    console.log('Fallaron las promesas')
})