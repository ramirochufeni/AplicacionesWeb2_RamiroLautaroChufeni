import express from 'express';
import cors from 'cors';
import rutasAPI from './api-crud/rutas/rutasAPI.mjs';
import cookieParser from 'cookie-parser';

// Configuración del servidor
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


servidor.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
