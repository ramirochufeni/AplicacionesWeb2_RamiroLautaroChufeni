import express from 'express';
import controlador from './controlador.usuario.mjs';

// Crear las rutas del módulo de usuarios
const rutasUsuarios = express.Router();

// Capturar datos del formulario
rutasUsuarios.use(express.json());
rutasUsuarios.use(express.urlencoded({ extended: true }));

// Registrar un nuevo usuario
rutasUsuarios.post(
    '/usuarios/registro',
    controlador.registrarUsuario
);

export default rutasUsuarios;
