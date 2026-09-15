# Aplicaciones Web 2 - Segunda etapa de trabajo practico

El proyecto representa un sistema de gestión de turnos para un servicio técnico de computación. La idea es organizar la información de los clientes, los servicios que ofrece el negocio y los turnos solicitados.

Para representar estos datos se utilizaron tres archivos JSON relacionados entre sí:

- clientes.json: contiene la información de los clientes registrados.

- servicios.json: contiene los distintos servicios técnicos disponibles.

- turnos.json: contiene los turnos solicitados por los clientes.

En esta segunda etapa se creó un servidor utilizando Express.js para poder realizar distintas solicitudes sobre los datos almacenados en los archivos JSON.

Las rutas utilizadas son:

- GET /clientes: obtiene todos los clientes registrados.

- GET /clientes/:id: obtiene un cliente específico mediante su ID.

- GET /servicios: obtiene todos los servicios disponibles.

- GET /turnos: obtiene todos los turnos registrados.

- POST /clientes: permite registrar un nuevo cliente.

- POST /turnos: permite registrar un nuevo turno. Antes de crearlo se verifica que el cliente y los servicios indicados existan.

- PUT /clientes/:id: permite actualizar los datos de un cliente existente.

- DELETE /clientes/:id: permite eliminar un cliente siempre que no tenga turnos asociados.

Para mantener la integridad de los datos, al intentar eliminar un cliente se verifica primero si posee turnos relacionados. Si el cliente tiene turnos registrados, la eliminación no se realiza.

También se agregó un archivo .gitignore para evitar la subida de la carpeta node_modules y del archivo package-lock.json al repositorio.

## Captura de prueba

Ejemplo de eliminación de un cliente mediante la ruta DELETE:

![Prueba DELETE cliente](./imagenes/delete-cliente.jpg)

La imagen muestra una prueba realizada con Thunder Client, donde se elimina correctamente un cliente que no posee turnos asociados.