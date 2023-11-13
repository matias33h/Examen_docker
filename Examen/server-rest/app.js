const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'mysql-db', // Nombre del contenedor MySQL
  user: 'root',
  password: 'root',
  database: 'perfiles'
});


// Conectar a la base de datos
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// Endpoint para insertar un perfil
app.post('/insertar_con_rest', (req, res) => {
  const { nomUsuario, perfil, activo } = req.body;
  const query = 'INSERT INTO perfiles (nomUsuario, perfil, activo) VALUES (?, ?, ?)';
  
  connection.query(query, [nomUsuario, perfil, activo], (error, results) => {
    if (error) {
      return res.status(500).send({ message: "Error al insertar el usuario", error });
    }
    res.status(201).send({ message: "Usuario insertado", id: results.insertId });
  });
});

// Iniciar el servidor
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
