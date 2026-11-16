import modelo from './modelo.orden.mjs';
import modeloClientes from '../clientes/modelo.cliente.mjs';
import modeloProductos from '../productos/modelo.producto.mjs';

// POST - Crear una nueva orden de compra
async function agregarOrden(peticion, respuesta) {
    const idCliente = peticion.usuario?.idCliente;
    const { productos } = peticion.body ?? {};

    // Validar datos obligatorios
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
        const cliente = await modeloClientes.obtenerCliente(idCliente);

        if (!cliente) {
            return respuesta.status(404).json({
                mensaje: 'El cliente no existe'
            });
        }

        // Obtener los productos desde MongoDB
        const productosDisponibles = await modeloProductos.obtenerProductos();

        let total = 0;
        const detalleProductos = [];
        const idsAgregados = new Set();

        // Validar productos, cantidades y stock
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

        const productosDescontados = [];

        try {
            // Descontar el stock verificando nuevamente su disponibilidad
            for (const item of detalleProductos) {
                const descontado = await modeloProductos.descontarStock(
                    item.idProducto,
                    item.cantidad
                );

                if (!descontado) {
                    const error = new Error(
                        `No hay stock suficiente de ${item.nombre}`
                    );

                    error.codigo = 'STOCK_INSUFICIENTE';
                    throw error;
                }

                productosDescontados.push(item);
            }

            // Guardar la orden en MongoDB
            const nuevaOrden = await modelo.agregarOrden({
                idCliente,
                productos: detalleProductos,
                total
            });

            return respuesta.status(201).json({
                mensaje: 'Orden creada correctamente',
                orden: nuevaOrden
            });

        } catch (error) {
            // Intentar recuperar el stock si la compra falló
            let restauracionCorrecta = true;

            for (const item of productosDescontados.reverse()) {
                try {
                    await modeloProductos.restaurarStock(
                        item.idProducto,
                        item.cantidad
                    );
                } catch (errorRestauracion) {
                    restauracionCorrecta = false;
                    console.error('Error al restaurar stock:', errorRestauracion);
                }
            }

            if (!restauracionCorrecta) {
                console.error('Se requiere revisar manualmente el stock');

                return respuesta.status(500).json({
                    mensaje: 'Error al crear la orden. Es necesario revisar el stock'
                });
            }

            if (error.codigo === 'STOCK_INSUFICIENTE') {
                return respuesta.status(409).json({
                    mensaje: error.message
                });
            }

            throw error;
        }

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
