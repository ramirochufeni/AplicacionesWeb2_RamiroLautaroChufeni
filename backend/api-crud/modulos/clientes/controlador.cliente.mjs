import modelo from './modelo.cliente.mjs';

// GET - Obtener todos los clientes
function obtenerClientes(peticion, respuesta) {
    try {
        const clientes = modelo.obtenerClientes();

        return respuesta.status(200).json(clientes);

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al obtener los clientes'
        });
    }
}

// GET - Obtener un cliente por ID
function obtenerCliente(peticion, respuesta) {
    const id = Number(peticion.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return respuesta.status(400).json({
            mensaje: 'ID de cliente inválido'
        });
    }

    try {
        const cliente = modelo.obtenerCliente(id);

        if (!cliente) {
            return respuesta.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        return respuesta.status(200).json(cliente);

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al obtener el cliente'
        });
    }
}

// POST - Crear un cliente
function agregarCliente(peticion, respuesta) {
    const { nombre, apellido, email, telefono } = peticion.body ?? {};

    if ([nombre, apellido, email, telefono].some(
        dato => typeof dato !== 'string' || !dato.trim()
    )) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    try {
        const nuevoCliente = modelo.agregarCliente({
            nombre,
            apellido,
            email,
            telefono
        });

        return respuesta.status(201).json({
            mensaje: 'Cliente creado correctamente',
            cliente: nuevoCliente
        });

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al crear el cliente'
        });
    }
}

// PUT - Actualizar un cliente
function modificarCliente(peticion, respuesta) {
    const id = Number(peticion.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return respuesta.status(400).json({
            mensaje: 'ID de cliente inválido'
        });
    }

    const { nombre, apellido, email, telefono, activo } = peticion.body ?? {};

    if (
        [nombre, apellido, email, telefono].some(
            dato => typeof dato !== 'string' || !dato.trim()
        ) ||
        typeof activo !== 'boolean'
    ) {
        return respuesta.status(400).json({
            mensaje: 'Datos incompletos o inválidos'
        });
    }

    try {
        const cliente = modelo.modificarCliente(id, {
            nombre,
            apellido,
            email,
            telefono,
            activo
        });

        if (!cliente) {
            return respuesta.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        return respuesta.status(200).json({
            mensaje: 'Cliente actualizado correctamente',
            cliente
        });

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al actualizar el cliente'
        });
    }
}

// DELETE - Eliminar un cliente
function eliminarCliente(peticion, respuesta) {
    const id = Number(peticion.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return respuesta.status(400).json({
            mensaje: 'ID de cliente inválido'
        });
    }

    try {
        const cliente = modelo.obtenerCliente(id);

        if (!cliente) {
            return respuesta.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        // Verificar relaciones antes de eliminar
        if (modelo.tieneRelaciones(id)) {
            return respuesta.status(409).json({
                mensaje: 'No se puede eliminar el cliente porque tiene turnos u órdenes asociadas'
            });
        }

        modelo.eliminarCliente(id);

        return respuesta.status(200).json({
            mensaje: 'Cliente eliminado correctamente'
        });

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al eliminar el cliente'
        });
    }
}

export default {
    obtenerClientes,
    obtenerCliente,
    agregarCliente,
    modificarCliente,
    eliminarCliente
};
