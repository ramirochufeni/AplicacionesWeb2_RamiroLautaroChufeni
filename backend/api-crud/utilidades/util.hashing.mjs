import bcrypt from 'bcryptjs';

// Crear el hash de una contraseña
async function hashClave(clave) {
    try {
        const salt = await bcrypt.genSalt(10);

        return await bcrypt.hash(clave, salt);

    } catch (error) {
        throw error;
    }
}

// Comparar una contraseña con su hash
async function compararClave(clave, hash) {
    try {
        return await bcrypt.compare(clave, hash);

    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    hashClave,
    compararClave
};
