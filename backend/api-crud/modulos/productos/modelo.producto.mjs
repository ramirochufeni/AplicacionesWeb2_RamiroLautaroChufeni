import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ARCHIVO_PRODUCTOS = fileURLToPath(
    new URL('../../datos/productos.json', import.meta.url)
);

// Leer los productos del archivo JSON
function leerArchivo() {
    const datos = fs.readFileSync(ARCHIVO_PRODUCTOS, 'utf-8');
    return JSON.parse(datos);
}

// Guardar los productos en el archivo JSON
function escribirArchivo(productos) {
    fs.writeFileSync(
        ARCHIVO_PRODUCTOS,
        JSON.stringify(productos, null, 2)
    );
}

// Obtener todos los productos
function obtenerProductos() {
    return leerArchivo();
}

// Obtener un producto por ID
function obtenerProducto(id) {
    const productos = leerArchivo();

    return productos.find(producto => producto.id === id) || null;
}

// Actualizar los productos
function guardarProductos(productos) {
    escribirArchivo(productos);
}

export default {
    obtenerProductos,
    obtenerProducto,
    guardarProductos
};
