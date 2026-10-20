import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ARCHIVO_TURNOS = fileURLToPath(
    new URL('../../datos/turnos.json', import.meta.url)
);

// Leer los turnos del archivo JSON
function leerArchivo() {
    const datos = fs.readFileSync(ARCHIVO_TURNOS, 'utf-8');
    return JSON.parse(datos);
}

// Guardar los turnos en el archivo JSON
function escribirArchivo(turnos) {
    fs.writeFileSync(
        ARCHIVO_TURNOS,
        JSON.stringify(turnos, null, 2)
    );
}

// Obtener todos los turnos
function obtenerTurnos() {
    return leerArchivo();
}

// Agregar un nuevo turno
function agregarTurno(datosTurno) {
    const turnos = leerArchivo();

    // Generar un ID para el nuevo turno
    const nuevoId = turnos.length > 0
        ? Math.max(...turnos.map(turno => turno.id)) + 1
        : 1001;

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

    turnos.push(nuevoTurno);

    escribirArchivo(turnos);

    return nuevoTurno;
}

export default {
    obtenerTurnos,
    agregarTurno
};
