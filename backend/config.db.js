const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    port: process.env.DBPORT 
});

connection.connect((err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err);
    } else {
        console.log("Conexión a la base de datos exitosa");
    }
});

module.exports = { connection };