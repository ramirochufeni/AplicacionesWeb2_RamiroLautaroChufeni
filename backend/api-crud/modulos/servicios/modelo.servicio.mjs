import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ARCHIVO_SERVICIOS = fileURLToPath(
    new URL('../../datos/servicios.json', import.meta.url)
);

// Leer los servicios del archivo JSON
function leerArchivo() {
    const datos = fs.readFileSync(ARCHIVO_SERVICIOS, 'utf-8');
    return JSON.parse(datos);
}

// Obtener todos los servicios
function obtenerServicios() {
    return leerArchivo();
}

export default {
    obtenerServicios
};
