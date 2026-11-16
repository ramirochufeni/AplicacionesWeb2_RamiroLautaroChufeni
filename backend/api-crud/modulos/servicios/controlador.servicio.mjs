import modelo from './modelo.servicio.mjs';

// GET - Obtener todos los servicios
async function obtenerServicios(peticion, respuesta) {
    try {
        const servicios = await modelo.obtenerServicios();

        return respuesta.status(200).json(servicios);

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al obtener los servicios'
        });
    }
}

export default {
    obtenerServicios
};
