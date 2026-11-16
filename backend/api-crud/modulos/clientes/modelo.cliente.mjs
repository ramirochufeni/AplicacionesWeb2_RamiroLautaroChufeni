import { obtenerBaseDatos } from '../../configuraciones/conexion.mongodb.mjs';

// Obtener todos los clientes
async function obtenerClientes() {
    const db = obtenerBaseDatos();

    return await db.collection('clientes')
        .find({})
        .project({ _id: 0 })
        .sort({ id: 1 })
        .toArray();
}

// Obtener un cliente por ID
async function obtenerCliente(id) {
    const db = obtenerBaseDatos();

    return await db.collection('clientes').findOne(
        { id },
        { projection: { _id: 0 } }
    );
}

// Agregar un nuevo cliente
async function agregarCliente(datosCliente) {
    const db = obtenerBaseDatos();
    const coleccion = db.collection('clientes');

    const ultimoCliente = await coleccion
        .find({})
        .sort({ id: -1 })
        .limit(1)
        .next();

    const nuevoId = ultimoCliente ? ultimoCliente.id + 1 : 1;

    const nuevoCliente = {
        id: nuevoId,
        nombre: datosCliente.nombre,
        apellido: datosCliente.apellido,
        email: datosCliente.email,
        telefono: datosCliente.telefono,
        activo: true
    };

    await coleccion.insertOne(nuevoCliente);

    const { _id, ...clienteSinIdMongo } = nuevoCliente;

    return clienteSinIdMongo;
}

// Modificar un cliente
async function modificarCliente(id, datosCliente) {
    const db = obtenerBaseDatos();
    const coleccion = db.collection('clientes');

    const resultado = await coleccion.updateOne(
        { id },
        {
            $set: {
                nombre: datosCliente.nombre,
                apellido: datosCliente.apellido,
                email: datosCliente.email,
                telefono: datosCliente.telefono,
                activo: datosCliente.activo
            }
        }
    );

    if (resultado.matchedCount === 0) {
        return null;
    }

    return await obtenerCliente(id);
}

// Verificar si un cliente tiene datos relacionados
async function tieneRelaciones(id) {
    const db = obtenerBaseDatos();

    const [turno, orden, usuario] = await Promise.all([
        db.collection('turnos').findOne({ idCliente: id }),
        db.collection('ordenes').findOne({ idCliente: id }),
        db.collection('usuarios').findOne({ idCliente: id })
    ]);

    return Boolean(turno || orden || usuario);
}

// Eliminar un cliente
async function eliminarCliente(id) {
    const db = obtenerBaseDatos();

    if (await tieneRelaciones(id)) {
        return false;
    }

    const resultado = await db.collection('clientes').deleteOne({ id });

    return resultado.deletedCount > 0;
}

export default {
    obtenerClientes,
    obtenerCliente,
    agregarCliente,
    modificarCliente,
    eliminarCliente,
    tieneRelaciones
};
