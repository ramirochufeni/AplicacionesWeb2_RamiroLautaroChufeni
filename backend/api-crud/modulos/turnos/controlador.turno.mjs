import modelo from './modelo.turno.mjs';
import modeloClientes from '../clientes/modelo.cliente.mjs';
import modeloServicios from '../servicios/modelo.servicio.mjs';

// GET - Obtener todos los turnos
function obtenerTurnos(peticion, respuesta) {
    try {
        const turnos = modelo.obtenerTurnos();

        return respuesta.status(200).json(turnos);

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al obtener los turnos'
        });
    }
}

// POST - Crear un nuevo turno
function agregarTurno(peticion, respuesta) {
    const {
        idCliente,
        fecha,
        hora,
        equipo,
        servicios
    } = peticion.body ?? {};

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

    try {
        // Verificar que el cliente exista
        const cliente = modeloClientes.obtenerCliente(idCliente);

        if (!cliente) {
            return respuesta.status(404).json({
                mensaje: 'El cliente no existe'
            });
        }

        // Obtener los servicios disponibles
        const serviciosDisponibles = modeloServicios.obtenerServicios();

        // Buscar los servicios solicitados
        const serviciosEncontrados = serviciosDisponibles.filter(
            servicio => servicios.includes(servicio.id)
        );

        // Verificar que todos los servicios existan
        const idsValidos = servicios.every(
            id => Number.isSafeInteger(id) && id > 0
        );

        const sinRepetidos = new Set(servicios).size === servicios.length;

        if (
            !idsValidos ||
            !sinRepetidos ||
            serviciosEncontrados.length !== servicios.length
        ) {
            return respuesta.status(400).json({
                mensaje: 'Uno o más servicios son inválidos o están repetidos'
            });
        }

        // Calcular el total del turno
        const total = serviciosEncontrados.reduce(
            (acumulador, servicio) => acumulador + servicio.precio,
            0
        );

        // Guardar el nuevo turno mediante el modelo
        const nuevoTurno = modelo.agregarTurno({
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

        return respuesta.status(500).json({
            mensaje: 'Error al crear el turno'
        });
    }
}

export default {
    obtenerTurnos,
    agregarTurno
};
