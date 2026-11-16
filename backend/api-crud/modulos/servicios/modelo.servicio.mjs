import { obtenerBaseDatos } from '../../configuraciones/conexion.mongodb.mjs';

// Obtener todos los servicios desde MongoDB
async function obtenerServicios() {
    const db = obtenerBaseDatos();

    return await db.collection('servicios')
        .find({})
        .project({ _id: 0 })
        .sort({ id: 1 })
        .toArray();
}

export default {
    obtenerServicios
};
