import { obtenerBaseDatos } from '../../configuraciones/conexion.mongodb.mjs';

// Obtener todas las órdenes
async function obtenerOrdenes() {
    const db = obtenerBaseDatos();

    return await db.collection('ordenes')
        .find({})
        .project({ _id: 0 })
        .sort({ id: 1 })
        .toArray();
}

// Agregar una nueva orden
async function agregarOrden(datosOrden) {
    const db = obtenerBaseDatos();
    const coleccion = db.collection('ordenes');

    // Obtener el último ID registrado
    const ultimaOrden = await coleccion
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .next();

    const nuevoId = ultimaOrden ? ultimaOrden.id + 1 : 1;

    const nuevaOrden = {
        id: nuevoId,
        idCliente: datosOrden.idCliente,
        productos: datosOrden.productos,
        total: datosOrden.total,
        fecha: new Date().toISOString()
    };

    await coleccion.insertOne(nuevaOrden);

    const { _id, ...ordenSinIdMongo } = nuevaOrden;

    return ordenSinIdMongo;
}

export default {
    obtenerOrdenes,
    agregarOrden
};
