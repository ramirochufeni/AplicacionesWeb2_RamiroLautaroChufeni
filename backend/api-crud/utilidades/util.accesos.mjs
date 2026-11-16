import { verificarToken } from './util.jwt.mjs';
import modeloUsuarios from '../modulos/usuarios/modelo.usuario.mjs';

// Comprobar que el usuario inició sesión
async function verificarTokenAcceso(peticion, respuesta, siguiente) {

    // Obtener el token de la cookie
    const token = peticion.cookies?._auth;

    // Comprobar si existe una sesión
    if (!token) {
        return respuesta.status(401).json({
            mensaje: 'Debés iniciar sesión'
        });
    }

    try {
        // Verificar que el token sea válido
        const datos = verificarToken(token);

        // Comprobar en MongoDB que el usuario todavía exista
        const usuario = await modeloUsuarios.obtenerUsuario(datos.id);

        if (
            !usuario ||
            usuario.idCliente !== datos.idCliente ||
            usuario.rol !== datos.rol
        ) {
            return respuesta.status(401).json({
                mensaje: 'Sesión inválida'
            });
        }

        // Guardar los datos del usuario en la petición
        peticion.usuario = {
            id: usuario.id,
            idCliente: usuario.idCliente,
            email: usuario.email,
            rol: usuario.rol
        };

        return siguiente();

    } catch (error) {
        console.error('Error al verificar la sesión:', error);

        return respuesta.status(401).json({
            mensaje: 'Sesión inválida o vencida'
        });
    }
}

export {
    verificarTokenAcceso
};
