import modelo from './modelo.usuario.mjs';
import modeloClientes from '../clientes/modelo.cliente.mjs';
import hashing from '../../utilidades/util.hashing.mjs';

// POST - Registrar un nuevo usuario
async function registrarUsuario(peticion, respuesta) {
    const {
        nombre,
        apellido,
        email,
        telefono,
        clave
    } = peticion.body ?? {};

    // Validar datos obligatorios
    if (
        [nombre, apellido, email, telefono, clave].some(
            dato => typeof dato !== 'string' || !dato.trim()
        )
    ) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Validar formato del correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
        return respuesta.status(400).json({
            mensaje: 'El correo electrónico no es válido'
        });
    }

    // Validar longitud de contraseña
    if (clave.length < 8 || clave.length > 72) {
        return respuesta.status(400).json({
            mensaje: 'La contraseña debe tener entre 8 y 72 caracteres'
        });
    }

    try {
        // Verificar si el usuario ya existe
        const usuarioExistente = modelo.obtenerUsuarioPorEmail(
            emailNormalizado
        );

        if (usuarioExistente) {
            return respuesta.status(409).json({
                mensaje: 'El correo ya está registrado'
            });
        }

        // Comprobar que el email no pertenece a otro cliente
        const clientes = modeloClientes.obtenerClientes();

        const clienteExistente = clientes.some(
            cliente =>
                typeof cliente.email === 'string' &&
                cliente.email.trim().toLowerCase() === emailNormalizado
        );

        if (clienteExistente) {
            return respuesta.status(409).json({
                mensaje: 'El correo ya pertenece a un cliente registrado'
            });
        }

        // Proteger la contraseña
        const claveHash = await hashing.hashClave(clave);

        // Crear el cliente
        const nuevoCliente = modeloClientes.agregarCliente({
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            email: emailNormalizado,
            telefono: telefono.trim()
        });

        // Crear la cuenta vinculada al cliente
        const nuevoUsuario = modelo.agregarUsuario({
            idCliente: nuevoCliente.id,
            email: emailNormalizado,
            claveHash
        });

        // Responder sin incluir la contraseña ni su hash
        return respuesta.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: {
                id: nuevoUsuario.id,
                idCliente: nuevoUsuario.idCliente,
                email: nuevoUsuario.email,
                rol: nuevoUsuario.rol
            }
        });

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al registrar el usuario'
        });
    }
}

export default {
    registrarUsuario
};
