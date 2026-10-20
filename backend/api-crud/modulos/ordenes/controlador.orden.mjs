import modelo from './modelo.orden.mjs';
import modeloClientes from '../clientes/modelo.cliente.mjs';
import modeloProductos from '../productos/modelo.producto.mjs';

// POST - Crear una nueva orden de compra
function agregarOrden(peticion, respuesta) {
const idCliente = peticion.usuario.idCliente;

// Obtener los productos enviados desde el carrito
const { productos } = peticion.body ?? {};

    // Validar los datos obligatorios
    if (
        !Number.isSafeInteger(idCliente) ||
        idCliente <= 0 ||
        !Array.isArray(productos) ||
        productos.length === 0
    ) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos obligatorios o son inválidos'
        });
    }

    try {
        // Verificar que el cliente exista
        const cliente = modeloClientes.obtenerCliente(idCliente);

        if (!cliente) {
            return respuesta.status(404).json({
                mensaje: 'El cliente no existe'
            });
        }

        // Obtener los productos disponibles
        const productosDisponibles = modeloProductos.obtenerProductos();

        let total = 0;
        const detalleProductos = [];
        const idsAgregados = new Set();

        // Verificar productos, cantidades y stock
        for (const item of productos) {

            if (
                !item ||
                !Number.isSafeInteger(item.idProducto) ||
                item.idProducto <= 0 ||
                !Number.isSafeInteger(item.cantidad) ||
                item.cantidad <= 0
            ) {
                return respuesta.status(400).json({
                    mensaje: 'Los productos o cantidades son inválidos'
                });
            }

            // Evitar productos repetidos en la misma orden
            if (idsAgregados.has(item.idProducto)) {
                return respuesta.status(400).json({
                    mensaje: 'Hay productos repetidos en la orden'
                });
            }

            idsAgregados.add(item.idProducto);

            const producto = productosDisponibles.find(
                producto => producto.id === item.idProducto
            );

            if (!producto) {
                return respuesta.status(404).json({
                    mensaje: `El producto ${item.idProducto} no existe`
                });
            }

            if (producto.stock < item.cantidad) {
                return respuesta.status(400).json({
                    mensaje: `No hay stock suficiente de ${producto.nombre}`
                });
            }

            // Calcular subtotal
            const subtotal = producto.precio * item.cantidad;

            total += subtotal;

            detalleProductos.push({
                idProducto: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: item.cantidad,
                subtotal
            });
        }

        // Descontar stock de los productos
        for (const item of productos) {
            const producto = productosDisponibles.find(
                producto => producto.id === item.idProducto
            );

            producto.stock -= item.cantidad;
        }

        // Guardar la orden mediante el modelo
        const nuevaOrden = modelo.agregarOrden({
            idCliente,
            productos: detalleProductos,
            total
        });

        // Guardar el stock actualizado
        modeloProductos.guardarProductos(productosDisponibles);

        return respuesta.status(201).json({
            mensaje: 'Orden creada correctamente',
            orden: nuevaOrden
        });

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al crear la orden'
        });
    }
}

export default {
    agregarOrden
};
