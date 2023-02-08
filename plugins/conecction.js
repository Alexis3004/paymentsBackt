const config = require('@config/app');
const moongose = require("mongoose");

//configuracion conexion
moongose.set('strictQuery', true);

moongose.connect(config.mongo.url, null, (err) => {
    if (err)
        console.log(err)
    else
        console.log("=> Connect with mongondb")
});

module.exports = moongose