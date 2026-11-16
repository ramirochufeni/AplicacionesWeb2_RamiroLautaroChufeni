import { readFile } from 'node:fs/promises';
import {
    conectarMongoDB,
    cerrarMongoDB
} from '../api-crud/configuraciones/conexion.mongodb.mjs';

const colecciones = [
    'clientes',
    'servicios',
    'turnos',
    'productos',
    'ordenes',
    'usuarios'
];

const importar = process.argv.includes('--importar');

async function leerDatos(nombre) {
    const ruta = new URL(
        `../api-crud/datos/${nombre}.json`,
        import.meta.url
    );

    const contenido = await readFile(ruta, 'utf8');
    const datos = JSON.parse(contenido);

    if (!Array.isArray(datos)) {
        throw new Error(`${nombre}.json no contiene un arreglo`);
    }

    const ids = datos.map((registro) => registro.id);

    if (
        ids.some((id) => !Number.isInteger(id)) ||
        new Set(ids).size !== ids.length
    ) {
        throw new Error(`Hay IDs invalidos o repetidos en ${nombre}`);
    }

    return datos;
}

async function migrar() {
    const datosPorColeccion = {};

    console.log('Revisando archivos JSON...\n');

    for (const nombre of colecciones) {
        const datos = await leerDatos(nombre);

        datosPorColeccion[nombre] = datos;

        console.log(`${nombre}: ${datos.length} registros`);
    }

    const total = Object.values(datosPorColeccion)
        .reduce((suma, datos) => suma + datos.length, 0);

    console.log(`\nTotal: ${total} registros`);

    const db = await conectarMongoDB();

    // Evitar importar sobre colecciones que ya contienen datos
    for (const nombre of colecciones) {
        const cantidad = await db.collection(nombre).countDocuments();

        if (cantidad > 0) {
            throw new Error(
                `La coleccion ${nombre} ya tiene ${cantidad} registros. ` +
                'Se cancelo la migracion para evitar duplicados.'
            );
        }
    }

    if (!importar) {
        console.log('\nComprobacion correcta.');
        console.log('No se modificaron los datos de MongoDB.');
        console.log('Para importar, ejecutar con --importar');
        return;
    }

    console.log('\nImportando datos a MongoDB...\n');

    for (const nombre of colecciones) {
        const datos = datosPorColeccion[nombre];
        const coleccion = db.collection(nombre);

        await coleccion.createIndex({ id: 1 }, { unique: true });

        if (datos.length > 0) {
            await coleccion.insertMany(datos);
        }

        const cantidad = await coleccion.countDocuments();

        if (cantidad !== datos.length) {
            throw new Error(`Cantidad incorrecta en ${nombre}`);
        }

        console.log(`${nombre}: ${cantidad} registros importados`);
    }

    console.log('\nMigracion finalizada correctamente.');
}

try {
    await migrar();
} catch (error) {
    console.error('\nError:', error.message);
    process.exitCode = 1;
} finally {
    await cerrarMongoDB();
}
