import modelo from './modelo.producto.mjs';

// GET - Obtener productos y filtrar por categoría
async function obtenerProductos(peticion, respuesta) {
    try {
        const productos = await modelo.obtenerProductos();

        const categoria = peticion.query.categoria;

        if (!categoria) {
            return respuesta.status(200).json(productos);
        }

        if (typeof categoria !== 'string') {
            return respuesta.status(400).json({
                mensaje: 'Categoría inválida'
            });
        }

        // Filtrar productos por categoría
        const productosFiltrados = productos.filter(
            producto =>
                producto.categoria.toLowerCase() === categoria.toLowerCase()
        );

        return respuesta.status(200).json(productosFiltrados);

    } catch (error) {
        console.error(error);

        return respuesta.status(500).json({
            mensaje: 'Error al obtener los productos'
        });
    }
}

export default {
    obtenerProductos
};
