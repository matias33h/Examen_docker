// Manejador de eventos para el formulario de inserción
document.getElementById('insertar-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const nomUsuario = document.getElementById('nomUsuario').value;
  const perfil = document.getElementById('perfil').value;
  const activo = document.getElementById('activo').value;

  console.log('Iniciando inserción:', { nomUsuario, perfil, activo }); // Añadido para depurar la inserción

  fetch('/api/insertar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomUsuario, perfil, activo }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta de inserción:', data); // Añadido para depurar la respuesta de inserción
    if (data && data.message) {
      document.getElementById('response').textContent = 'Perfil insertado con éxito: ' + data.message;
    } else {
      document.getElementById('response').textContent = 'Error en la respuesta del servidor';
    }
  })
  .catch(error => {
    console.error('Error al insertar:', error); // Añadido para depurar errores de inserción
    document.getElementById('response').textContent = 'Error al insertar perfil: ' + error.message;
  });
});

// Manejador de eventos para el formulario de consulta
document.getElementById('consultar-form').addEventListener('submit', function(e) {
  e.preventDefault();

  console.log('Iniciando consulta'); // Añadido para depurar la consulta

  // Limpiar la tabla antes de realizar la consulta
  const tableBody = document.getElementById('perfilTableBody');
  tableBody.innerHTML = '';

  fetch('/api/consultar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta de consulta:', data); // Añadido para depurar la respuesta de consulta
    if (data && data['soap:Envelope'] && data['soap:Envelope']['soap:Body']) {
      const perfiles = data['soap:Envelope']['soap:Body'][0].perfiles;

      perfiles.forEach(perfil => {
        const usuario = perfil.nomUsuario[0];
        const perfilNombre = perfil.perfil[0];
        const activo = perfil.activo[0] === "1" ? "Sí" : "No";

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${usuario}</td>
          <td>${perfilNombre}</td>
          <td>${activo}</td>
        `;

        tableBody.appendChild(row);
      });
    } else {
      document.getElementById('response').textContent = 'Respuesta del servidor no válida';
    }
  })
  .catch(error => {
    console.error('Error al consultar:', error); // Añadido para depurar errores de consulta
    document.getElementById('response').textContent = 'Error al consultar perfiles: ' + error.message;
  });
});
