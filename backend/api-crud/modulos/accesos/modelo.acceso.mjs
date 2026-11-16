import modeloUsuarios from '../usuarios/modelo.usuario.mjs';

// Buscar un usuario por su correo electrónico
async function verificarAcceso({ email }) {
    if (typeof email !== 'string' || !email.trim()) {
        return null;
    }

    return await modeloUsuarios.obtenerUsuarioPorEmail(
        email.trim().toLowerCase()
    );
}

export default {
    verificarAcceso
};
