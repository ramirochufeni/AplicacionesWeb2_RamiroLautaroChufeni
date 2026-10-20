import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ARCHIVO_CLIENTES = fileURLToPath(
    new URL('../../datos/clientes.json', import.meta.url)
);

const ARCHIVO_TURNOS = fileURLToPath(
    new URL('../../datos/turnos.json', import.meta.url)
);

const ARCHIVO_ORDENES = fileURLToPath(
    new URL('../../datos/ordenes.json', import.meta.url)
);

// Lee los clientes del archivo JSON
function leerArchivo() {
    const datos = fs.readFileSync(ARCHIVO_CLIENTES, 'utf-8');
    return JSON.parse(datos);
}

// Guarda los clientes en el archivo JSON
function escribirArchivo(clientes) {
    fs.writeFileSync(
        ARCHIVO_CLIENTES,
        JSON.stringify(clientes, null, 2)
    );
}


function obtenerClientes() {
    return leerArchivo();
}


function obtenerCliente(id) {
    const clientes = leerArchivo();

    return clientes.find(cliente => cliente.id === id) || null;
}

// Agregar un nuevo cliente
function agregarCliente(datosCliente) {
    const clientes = leerArchivo();

    const nuevoId = clientes.length > 0
        ? Math.max(...clientes.map(cliente => cliente.id)) + 1
        : 1;

    const nuevoCliente = {
        id: nuevoId,
        nombre: datosCliente.nombre,
        apellido: datosCliente.apellido,
        email: datosCliente.email,
        telefono: datosCliente.telefono,
        activo: true
    };

    clientes.push(nuevoCliente);

    escribirArchivo(clientes);

    return nuevoCliente;
}

// Modificar un cliente existente
function modificarCliente(id, datosCliente) {
    const clientes = leerArchivo();

    const indice = clientes.findIndex(
        cliente => cliente.id === id
    );

    if (indice === -1) {
        return null;
    }

    clientes[indice] = {
        id,
        nombre: datosCliente.nombre,
        apellido: datosCliente.apellido,
        email: datosCliente.email,
        telefono: datosCliente.telefono,
        activo: datosCliente.activo
    };

    escribirArchivo(clientes);

    return clientes[indice];
}

// Eliminar un cliente
function eliminarCliente(id) {
    const clientes = leerArchivo();

    const cliente = clientes.find(
        cliente => cliente.id === id
    );

    if (!cliente) {
        return false;
    }

    const clientesActualizados = clientes.filter(
        cliente => cliente.id !== id
    );

    escribirArchivo(clientesActualizados);

    return true;
}

// Verificar si un cliente tiene turnos u órdenes
function tieneRelaciones(id) {
    const turnos = JSON.parse(
        fs.readFileSync(ARCHIVO_TURNOS, 'utf-8')
    );

    const ordenes = JSON.parse(
        fs.readFileSync(ARCHIVO_ORDENES, 'utf-8')
    );

    const tieneTurnos = turnos.some(
        turno => turno.idCliente === id
    );

    const tieneOrdenes = ordenes.some(
        orden => orden.idCliente === id
    );

    return tieneTurnos || tieneOrdenes;
}

export default {
    obtenerClientes,
    obtenerCliente,
    agregarCliente,
    modificarCliente,
    eliminarCliente,
    tieneRelaciones
};
