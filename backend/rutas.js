const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const {connection} = require('./config.db');

app.route("/login").post((req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Lleno los campos de usuario y contraseña"});
    }

    const query = 'SELECT * FROM anunciante WHERE nombre_usuario = ?';
    connection.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({message: "Internal server error"});
        }

        if (results.length === 0) {
            return res.status(404).json({message: "Usuario o contraseña no encontrados"});
        }

        const user = results[0];

        if(password != user.contraseña){
            return res.status(401).json({message: "Contraseña incorrecta"});
        }
        return res.json({
            message: "Sesión iniciada"
        });
    });
    });

    module .exports = app;