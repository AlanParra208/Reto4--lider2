const express = require('express')
const app = express()
const cors = require('cors');
const allowedOrigins = ['http://localhost:5173', 'http://localhost:8081'];

app.use(cors());

app.use(express.json());

app.use(require('./rutas'));

app.listen(process.env.PORT||3000,() => {
  console.log(`Servidor corriendo en el puerto 3000`)
});

module.exports = app;