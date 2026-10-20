import { verificarToken } from './util.jwt.mjs';
import modeloUsuarios from '../modulos/usuarios/modelo.usuario.mjs';

// Comprobar que el usuario inicio sesion
function verificarTokenAcceso(peticion, respuesta, siguiente) {

    // Obtener el token de la cookie
    const token = peticion.cookies?._auth;

    // Comprobar si existe una sesion
    if (!token) {
        return respuesta.status(401).json({
            mensaje: 'Debés iniciar sesión'
        });
    }

    try {
        // Verificar que el token sea válido
        const datos = verificarToken(token);

        // Comprobar que el usuario todavía exista
        const usuario = modeloUsuarios.obtenerUsuario(datos.id);

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

        siguiente();

    } catch (error) {
        return respuesta.status(401).json({
            mensaje: 'Sesión inválida o vencida'
        });
    }
}

export {
    verificarTokenAcceso
};
