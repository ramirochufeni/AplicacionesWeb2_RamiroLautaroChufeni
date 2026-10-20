import modeloUsuarios from '../usuarios/modelo.usuario.mjs';

// Buscar un usuario por su correo electrónico
function verificarAcceso({ email }) {
    if (typeof email !== 'string' || !email.trim()) {
        return null;
    }

    return modeloUsuarios.obtenerUsuarioPorEmail(email);
}

export default {
    verificarAcceso
};
