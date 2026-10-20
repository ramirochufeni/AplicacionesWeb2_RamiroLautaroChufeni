import express from 'express';
import controlador from './controlador.cliente.mjs';

// Crear las rutas de clientes
const rutasClientes = express.Router();

// Obtener datos del cuerpo de las peticiones
rutasClientes.use(express.json());

// Rutas para todos los clientes
rutasClientes
    .route('/clientes')
    .get(controlador.obtenerClientes)
    .post(controlador.agregarCliente);

// Rutas para un cliente específico
rutasClientes
    .route('/clientes/:id')
    .get(controlador.obtenerCliente)
    .put(controlador.modificarCliente)
    .delete(controlador.eliminarCliente);


export default rutasClientes;
