import express  from 'express';
import bodyParser  from 'body-parser';
import path  from 'path';
import soapRequest  from 'easy-soap-request';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import cors  from 'cors';
import { parseStringPromise } from 'xml2js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/insertar', async (req, res) => {
  const { nomUsuario, perfil, activo } = req.body;
  try {
    const response = await fetch('http://rest-api:8080/insertar_con_rest', { 
      method: 'POST',
      body: JSON.stringify({ nomUsuario, perfil, activo }),
      headers: { 'Content-Type': 'application/json' },
    });

    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error('Error al realizar la solicitud REST:', error);
    res.status(500).send('Error al conectar con el servicio REST');
  }
});

// Endpoint para consumir el servicio SOAP
app.post('/api/consultar', async (req, res) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:web="http://example.com/perfiles.wsdl">
    <soapenv:Header/>
    <soapenv:Body>
      <web:consultarTodosLosPerfilesRequest>
      </web:consultarTodosLosPerfilesRequest>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const { response } = await soapRequest({
      url: 'http://soap-api:8080/consultar_con_soap',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'soapAction': 'http://example.com/consultarTodosLosPerfiles',
      },
      xml,
    });

    if (response.statusCode !== 200) {
      throw new Error(`HTTP error! status: ${response.statusCode}`);
    }

    // Parsear el XML a JSON
    parseStringPromise(response.body).then(parsed => {
      console.log('Respuesta SOAP en JSON:', parsed);
      // La respuesta ahora está en un objeto JSON
      res.json(parsed);
    }).catch(parseError => {
      console.error('Error al parsear XML:', parseError);
      
      res.status(500).send('Error al parsear la respuesta SOAP');
      
    });
  } catch (error) {
    console.error('Error al realizar la solicitud SOAP:', error);
    res.status(500).send('Error al conectar con el servicio SOAP');
  }
});



// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
