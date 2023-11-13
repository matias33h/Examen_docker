const soap = require('strong-soap').soap;
const http = require('http');
const fs = require('fs');
const mysql = require('mysql');

const hola = 'hola'
console.log("Enviando perfiles:", hola); 

// Cargar el archivo WSDL
const wsdl = fs.readFileSync('PerfilesService.wsdl', 'utf8');

// Crear la conexión a la base de datos
const dbConnection = mysql.createConnection({
  host: 'mysql-db', // Asegúrate de que este sea el nombre del servicio de MySQL en Docker
  user: 'root',
  password: 'root',
  database: 'perfiles'
});

// Conectar a la base de datos
dbConnection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// Definir el objeto de servicio SOAP
const serviceObject = {
  PerfilesService: {
    PerfilesPort: {
      consultarTodosLosPerfiles: function(args, callback) {
        dbConnection.query('SELECT * FROM perfiles', (error, results) => {
          if (error) {
            console.error("Error al consultar la base de datos: ", error);
            callback(error);
            return;
          }
          // Si no hay perfiles, manejar adecuadamente
          if (results.length === 0) {
            callback(null, { resultado: 'No se encontraron perfiles' });
            return;
          }
          
          
          // Convertir los resultados a la estructura esperada por el WSDL
          const perfiles = results.map(perfil => ({
            nomUsuario: perfil.nomUsuario,
            perfil: perfil.perfil,
            activo: perfil.activo

            
          }));

          console.log("Enviando perfiles:", perfiles); 
          callback(null, { perfiles });


          
        });
      }
    }
  }
};


// Configurar el servidor HTTP para responder a los requests
const server = http.createServer(function(request, response) {
  response.end('404: Not Found: ' + request.url);
});

// Escuchar en el puerto 8080
server.listen(8080, () => {
  console.log('SOAP server escuchando en el puerto 8080');
  // Configurar el listener SOAP con la ruta '/wsdl'
  soap.listen(server, '/consultar_con_soap', serviceObject, wsdl);
});
