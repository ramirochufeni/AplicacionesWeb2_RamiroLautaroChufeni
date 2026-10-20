import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Ruta del archivo JSON de ordenes
const ARCHIVO_ORDENES = fileURLToPath(
    new URL('../../datos/ordenes.json', import.meta.url)
);

// Leer las ordenes del archivo JSON
function leerArchivo() {
    const datos = fs.readFileSync(ARCHIVO_ORDENES, 'utf-8');
    return JSON.parse(datos);
}

// Guardar las ordenes en el archivo JSON
function escribirArchivo(ordenes) {
    fs.writeFileSync(
        ARCHIVO_ORDENES,
        JSON.stringify(ordenes, null, 2)
    );
}

// Obtener todas las ordenes
function obtenerOrdenes() {
    return leerArchivo();
}

// Agregar una nueva orden
function agregarOrden(datosOrden) {
    const ordenes = leerArchivo();

    // Generar un ID para la nueva orden
    const nuevoId = ordenes.length > 0
        ? Math.max(...ordenes.map(orden => orden.id)) + 1
        : 1;

    const nuevaOrden = {
        id: nuevoId,
        idCliente: datosOrden.idCliente,
        productos: datosOrden.productos,
        total: datosOrden.total,
        fecha: new Date().toISOString()
    };

    ordenes.push(nuevaOrden);

    escribirArchivo(ordenes);

    return nuevaOrden;
}

export default {
    obtenerOrdenes,
    agregarOrden
};
