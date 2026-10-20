import express from 'express';
import controlador from './controlador.turno.mjs';

// Crear las rutas de turnos
const rutasTurnos = express.Router();

// Obtener los datos enviados en las peticiones
rutasTurnos.use(express.json());

rutasTurnos
    .route('/turnos')
    .get(controlador.obtenerTurnos)
    .post(controlador.agregarTurno);

export default rutasTurnos;
