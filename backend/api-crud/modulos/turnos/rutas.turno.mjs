import express from 'express';
import controlador from './controlador.turno.mjs';
import { verificarTokenAcceso } from '../../utilidades/util.accesos.mjs';

const rutasTurnos = express.Router();

rutasTurnos.use(express.json());

rutasTurnos
    .route('/turnos')
    .get(verificarTokenAcceso, controlador.obtenerTurnos)
    .post(verificarTokenAcceso, controlador.agregarTurno);

export default rutasTurnos;
