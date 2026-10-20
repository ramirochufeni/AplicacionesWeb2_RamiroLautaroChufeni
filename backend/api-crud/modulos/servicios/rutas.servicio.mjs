import express from 'express';
import controlador from './controlador.servicio.mjs';

// Crear las rutas de servicios
const rutasServicios = express.Router();

// GET - Obtener todos los servicios
rutasServicios
    .route('/servicios')
    .get(controlador.obtenerServicios);

export default rutasServicios;
