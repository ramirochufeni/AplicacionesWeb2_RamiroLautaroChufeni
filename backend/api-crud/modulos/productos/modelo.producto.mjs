import { obtenerBaseDatos } from '../../configuraciones/conexion.mongodb.mjs';

// Obtener todos los productos
async function obtenerProductos() {
    const db = obtenerBaseDatos();

    return await db.collection('productos')
        .find({})
        .project({ _id: 0 })
        .sort({ id: 1 })
        .toArray();
}

// Obtener un producto por ID
async function obtenerProducto(id) {
    const db = obtenerBaseDatos();

    return await db.collection('productos').findOne(
        { id },
        { projection: { _id: 0 } }
    );
}

// Descontar stock solamente si hay unidades suficientes
async function descontarStock(id, cantidad) {
    const db = obtenerBaseDatos();

    const resultado = await db.collection('productos').updateOne(
        {
            id,
            stock: { $gte: cantidad }
        },
        {
            $inc: { stock: -cantidad }
        }
    );

    return resultado.modifiedCount === 1;
}

// Restaurar stock si una compra no se completa
async function restaurarStock(id, cantidad) {
    const db = obtenerBaseDatos();

    const resultado = await db.collection('productos').updateOne(
        { id },
        {
            $inc: { stock: cantidad }
        }
    );

    if (resultado.matchedCount !== 1) {
        throw new Error(`No se pudo restaurar el stock del producto ${id}`);
    }
}

export default {
    obtenerProductos,
    obtenerProducto,
    descontarStock,
    restaurarStock
};
