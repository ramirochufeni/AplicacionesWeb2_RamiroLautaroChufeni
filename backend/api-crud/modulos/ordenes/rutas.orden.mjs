import express from 'express';
import controlador from './controlador.orden.mjs';
import { verificarTokenAcceso } from '../../utilidades/util.accesos.mjs';

// Crear las rutas de ordenes
const rutasOrdenes = express.Router();

// Obtener los datos enviados en las peticiones
rutasOrdenes.use(express.json());

// POST - Crear una nueva orden de compra
rutasOrdenes
    .route('/ordenes')
    .post(verificarTokenAcceso, controlador.agregarOrden);

export default rutasOrdenes;
