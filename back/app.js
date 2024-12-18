'use strict'
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;

var cliente_route = require('./routes/cliente');
var admin_route = require('./routes/admin');

// Función asíncrona para conectar a MongoDB
async function connectDB() {
    try {
        // Usamos async/await en lugar de callback
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda1', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conectado a MongoDB');

        // Solo iniciamos el servidor una vez que la conexión sea exitosa
        app.listen(port, function() {
            console.log('Servidor corriendo en el puerto ' + port);
        });
    } catch (err) {
        console.log('Error de conexión a MongoDB:', err);
    }
}

// Llamar a la función para conectar a la base de datos
connectDB();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api', cliente_route);
app.use('/api', admin_route);

module.exports = app;