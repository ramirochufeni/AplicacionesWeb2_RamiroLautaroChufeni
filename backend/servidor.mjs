import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import rutasAPI from './api-crud/rutas/rutasAPI.mjs';
import { conectarMongoDB } from './api-crud/configuraciones/conexion.mongodb.mjs';

const PUERTO = 3000;

const servidor = express();

servidor.use(cors({
    origin: 'http://localhost:4321',
    credentials: true
}));

servidor.use(express.json());
servidor.use(cookieParser());

servidor.use(rutasAPI);

servidor.get('/', (peticion, respuesta) => {
    respuesta.send('Servidor funcionando correctamente');
});

// Conectar MongoDB antes de iniciar el servidor
async function iniciarServidor() {
    try {
        await conectarMongoDB();

        servidor.listen(PUERTO, () => {
            console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

iniciarServidor();
