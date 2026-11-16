import { obtenerBaseDatos } from '../../configuraciones/conexion.mongodb.mjs';

// Obtener un usuario por email
async function obtenerUsuarioPorEmail(email) {
    if (typeof email !== 'string' || !email.trim()) {
        return null;
    }

    const db = obtenerBaseDatos();

    return await db.collection('usuarios').findOne(
        { email: email.trim().toLowerCase() },
        { projection: { _id: 0 } }
    );
}

// Obtener un usuario por ID
async function obtenerUsuario(id) {
    const db = obtenerBaseDatos();

    return await db.collection('usuarios').findOne(
        { id },
        { projection: { _id: 0 } }
    );
}

// Buscar si un cliente ya tiene una cuenta
async function obtenerUsuarioPorCliente(idCliente) {
    const db = obtenerBaseDatos();

    return await db.collection('usuarios').findOne(
        { idCliente },
        { projection: { _id: 0 } }
    );
}

// Agregar un nuevo usuario
async function agregarUsuario(datosUsuario) {
    const db = obtenerBaseDatos();
    const coleccion = db.collection('usuarios');

    const ultimoUsuario = await coleccion
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .next();

    const nuevoId = ultimoUsuario ? ultimoUsuario.id + 1 : 1;

    const nuevoUsuario = {
        id: nuevoId,
        idCliente: datosUsuario.idCliente,
        email: datosUsuario.email.trim().toLowerCase(),
        claveHash: datosUsuario.claveHash,
        rol: 'cliente'
    };

    await coleccion.insertOne(nuevoUsuario);

    const { _id, ...usuarioSinIdMongo } = nuevoUsuario;

    return usuarioSinIdMongo;
}

export default {
    obtenerUsuarioPorEmail,
    obtenerUsuario,
    obtenerUsuarioPorCliente,
    agregarUsuario
};
