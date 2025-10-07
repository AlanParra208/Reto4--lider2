const express = require('express')
const app = express()
const allowedOrigins = ['http://localhost:5173', 'http://localhost:8081'];

app.use(express.json());

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(require('./rutas'));

app.listen(process.env.PORT||3000,() => {
  console.log(`Servidor corriendo en el puerto 3000`)
});

module.exports = app;