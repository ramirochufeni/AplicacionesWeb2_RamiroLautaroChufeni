import modelo from './modelo.turno.mjs';
import modeloClientes from '../clientes/modelo.cliente.mjs';
import modeloServicios from '../servicios/modelo.servicio.mjs';

// GET - Obtener los turnos del cliente autenticado
async function obtenerTurnos(peticion, respuesta) {
    try {
        const idCliente = peticion.usuario?.idCliente;

        if (!Number.isSafeInteger(idCliente) || idCliente <= 0) {
            return respuesta.status(403).json({
                mensaje: 'No tenés un cliente asociado'
            });
        }

        const turnos = await modelo.obtenerTurnos(idCliente);

        return respuesta.status(200).json(turnos);

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al obtener los turnos'
        });
    }
}

// POST - Crear un nuevo turno
async function agregarTurno(peticion, respuesta) {
    const {
    fecha,
    hora,
    equipo,
    servicios
} = peticion.body ?? {};


const idCliente = peticion.usuario?.idCliente;

    // Validar datos obligatorios
    if (
        !Number.isSafeInteger(idCliente) ||
        idCliente <= 0 ||
        typeof fecha !== 'string' || !fecha.trim() ||
        typeof hora !== 'string' || !hora.trim() ||
        typeof equipo !== 'string' || !equipo.trim() ||
        !Array.isArray(servicios) ||
        servicios.length === 0
    ) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos obligatorios o son inválidos'
        });
    }


    // Comprobar el formato de fecha y hora
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/.test(fecha);
    const formatoHora = /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);

    const fechaHora = formatoFecha && formatoHora
        ? new Date(`${fecha}T${hora}:00`)
        : null;

    const fechaValida = fechaHora !== null &&
        !Number.isNaN(fechaHora.getTime()) &&
        fechaHora.getFullYear() === Number(fecha.slice(0, 4)) &&
        fechaHora.getMonth() + 1 === Number(fecha.slice(5, 7)) &&
        fechaHora.getDate() === Number(fecha.slice(8, 10));

    if (!fechaValida || fechaHora <= new Date()) {
        return respuesta.status(400).json({
            mensaje: 'Seleccioná una fecha y hora futuras y válidas'
        });
    }


    // Validar los IDs de los servicios
    const idsValidos = servicios.every(
        id => Number.isSafeInteger(id) && id > 0
    );

    const sinRepetidos = new Set(servicios).size === servicios.length;

    if (!idsValidos || !sinRepetidos) {
        return respuesta.status(400).json({
            mensaje: 'Uno o más servicios son inválidos o están repetidos'
        });
    }

    try {
        // Verificar que el cliente exista en MongoDB
        const cliente = await modeloClientes.obtenerCliente(idCliente);

        if (!cliente) {
            return respuesta.status(404).json({
                mensaje: 'El cliente no existe'
            });
        }

        // Obtener los servicios disponibles desde MongoDB
        const serviciosDisponibles = await modeloServicios.obtenerServicios();

        // Buscar los servicios solicitados
        const serviciosEncontrados = serviciosDisponibles.filter(
            servicio => servicios.includes(servicio.id)
        );

        // Comprobar que todos existan
        if (serviciosEncontrados.length !== servicios.length) {
            return respuesta.status(400).json({
                mensaje: 'Uno o más servicios no existen'
            });
        }

        // Calcular el total del turno
        const total = serviciosEncontrados.reduce(
            (acumulador, servicio) => acumulador + servicio.precio,
            0
        );

        // Guardar el turno en MongoDB
        const nuevoTurno = await modelo.agregarTurno({
            idCliente,
            fecha,
            hora,
            equipo,
            servicios,
            total
        });

        return respuesta.status(201).json({
            mensaje: 'Turno creado correctamente',
            turno: nuevoTurno
        });

    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return respuesta.status(409).json({
                mensaje: 'No se pudo generar un ID único para el turno'
            });
        }

        return respuesta.status(500).json({
            mensaje: 'Error al crear el turno'
        });
    }
}

export default {
    obtenerTurnos,
    agregarTurno
};
