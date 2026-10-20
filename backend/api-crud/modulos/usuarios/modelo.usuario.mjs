import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Ruta del archivo JSON de usuarios
const ARCHIVO_USUARIOS = fileURLToPath(
    new URL('../../datos/usuarios.json', import.meta.url)
);

// Leer los usuarios
function leerArchivo() {
    const datos = fs.readFileSync(ARCHIVO_USUARIOS, 'utf-8');
    return JSON.parse(datos);
}

// Guardar los usuarios
function escribirArchivo(usuarios) {
    fs.writeFileSync(
        ARCHIVO_USUARIOS,
        JSON.stringify(usuarios, null, 2)
    );
}

// Obtener un usuario por email
function obtenerUsuarioPorEmail(email) {
    const usuarios = leerArchivo();

    return usuarios.find(
        usuario => usuario.email === email.trim().toLowerCase()
    ) || null;
}

// Obtener un usuario por ID
function obtenerUsuario(id) {
    const usuarios = leerArchivo();

    return usuarios.find(
        usuario => usuario.id === id
    ) || null;
}

// Buscar si un cliente ya tiene una cuenta
function obtenerUsuarioPorCliente(idCliente) {
    const usuarios = leerArchivo();

    return usuarios.find(
        usuario => usuario.idCliente === idCliente
    ) || null;
}

// Agregar un nuevo usuario
function agregarUsuario(datosUsuario) {
    const usuarios = leerArchivo();

    const nuevoId = usuarios.length > 0
        ? Math.max(...usuarios.map(usuario => usuario.id)) + 1
        : 1;

    const nuevoUsuario = {
        id: nuevoId,
        idCliente: datosUsuario.idCliente,
        email: datosUsuario.email.trim().toLowerCase(),
        claveHash: datosUsuario.claveHash,
        rol: 'cliente'
    };

    usuarios.push(nuevoUsuario);

    escribirArchivo(usuarios);

    return nuevoUsuario;
}

export default {
    obtenerUsuarioPorEmail,
    obtenerUsuario,
    obtenerUsuarioPorCliente,
    agregarUsuario
};
