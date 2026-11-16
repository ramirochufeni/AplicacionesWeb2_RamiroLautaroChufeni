import modelo from './modelo.acceso.mjs';
import hashing from '../../utilidades/util.hashing.mjs';
import { firmarToken } from '../../utilidades/util.jwt.mjs';

// Configuración de la cookie
const OPCIONES_COOKIE = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
};

// POST - Iniciar sesión
async function verificarAcceso(peticion, respuesta) {
    const { email, clave } = peticion.body ?? {};

    if (
        typeof email !== 'string' ||
        !email.trim() ||
        typeof clave !== 'string' ||
        !clave
    ) {
        return respuesta.status(400).json({
            mensaje: 'Correo y contraseña obligatorios'
        });
    }

    try {
        // Buscar al usuario en MongoDB
        const usuario = await modelo.verificarAcceso({
            email: email.trim().toLowerCase()
        });

        if (!usuario) {
            return respuesta.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        // Verificar la contraseña con bcrypt
        const claveCorrecta = await hashing.compararClave(
            clave,
            usuario.claveHash
        );

        if (!claveCorrecta) {
            return respuesta.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        // Crear el JWT
        const datosToken = {
            id: usuario.id,
            idCliente: usuario.idCliente,
            rol: usuario.rol
        };

        const token = firmarToken(datosToken);

        // Guardar el JWT en una cookie
        respuesta.cookie('_auth', token, {
            ...OPCIONES_COOKIE,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return respuesta.status(200).json({
            mensaje: 'Sesión iniciada correctamente',
            usuario: {
                id: usuario.id,
                idCliente: usuario.idCliente,
                email: usuario.email,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al iniciar sesión'
        });
    }
}

// POST - Cerrar sesión
function cerrarSesion(peticion, respuesta) {
    respuesta.clearCookie('_auth', OPCIONES_COOKIE);

    return respuesta.status(200).json({
        mensaje: 'Sesión cerrada correctamente'
    });
}

// GET - Consultar la sesión actual
function obtenerSesion(peticion, respuesta) {

    // Evitar que el navegador almacene la sesión en caché
    respuesta.set('Cache-Control', 'no-store');

    return respuesta.status(200).json({
        autenticado: true,
        usuario: peticion.usuario
    });
}

export default {
    verificarAcceso,
    cerrarSesion,
    obtenerSesion
};
