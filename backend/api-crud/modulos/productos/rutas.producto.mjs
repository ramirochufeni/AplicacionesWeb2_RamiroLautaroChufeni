import express from 'express';
import controlador from './controlador.producto.mjs';

// Crear las rutas de productos
const rutasProductos = express.Router();

// GET - Obtener productos y filtrar por categoría
rutasProductos
    .route('/productos')
    .get(controlador.obtenerProductos);

export default rutasProductos;
