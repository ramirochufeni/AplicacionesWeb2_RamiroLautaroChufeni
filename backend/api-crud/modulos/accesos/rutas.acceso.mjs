import express from 'express';
import controlador from './controlador.acceso.mjs';
import { verificarTokenAcceso } from '../../utilidades/util.accesos.mjs';

// Crear las rutas del módulo de accesos
const rutasAcceso = express.Router();

// Recibir datos del formulario
rutasAcceso.use(express.json());
rutasAcceso.use(express.urlencoded({ extended: true }));

// Iniciar sesión
rutasAcceso.post('/verificar', controlador.verificarAcceso);

// Cerrar sesión
rutasAcceso.post('/cerrar', controlador.cerrarSesion);

// Consultar la sesión actual
rutasAcceso.get(
    '/sesion',
    verificarTokenAcceso,
    controlador.obtenerSesion
);

export default rutasAcceso;
