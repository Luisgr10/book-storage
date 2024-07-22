const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); 
const routes = require('../routes/routes'); // Asegúrate de que la ruta es correcta

const app = express();

// Configura CORS para permitir todas las solicitudes
app.use(cors());

app.use(morgan('dev'));

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Usar las rutas después de configurar el middleware JSON
app.use(routes);

module.exports = app;

