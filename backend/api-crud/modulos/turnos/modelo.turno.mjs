import { obtenerBaseDatos } from '../../configuraciones/conexion.mongodb.mjs';

// Obtener todos los turnos
async function obtenerTurnos() {
    const db = obtenerBaseDatos();

    return await db.collection('turnos')
        .find({})
        .project({ _id: 0 })
        .sort({ id: 1 })
        .toArray();
}

// Agregar un nuevo turno
async function agregarTurno(datosTurno) {
    const db = obtenerBaseDatos();
    const coleccion = db.collection('turnos');

    // Obtener el último ID registrado
    const ultimoTurno = await coleccion
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .next();

    const nuevoId = ultimoTurno ? ultimoTurno.id + 1 : 1001;

    const nuevoTurno = {
        id: nuevoId,
        idCliente: datosTurno.idCliente,
        fecha: datosTurno.fecha,
        hora: datosTurno.hora,
        equipo: datosTurno.equipo,
        servicios: datosTurno.servicios,
        total: datosTurno.total,
        pagado: false,
        finalizado: false
    };

    // Guardar el turno en MongoDB
    await coleccion.insertOne(nuevoTurno);

    const { _id, ...turnoSinIdMongo } = nuevoTurno;

    return turnoSinIdMongo;
}

export default {
    obtenerTurnos,
    agregarTurno
};
