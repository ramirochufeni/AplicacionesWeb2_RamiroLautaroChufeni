import 'dotenv/config';
import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const NOMBRE_BD = process.env.MONGODB_DB || 'ramatech';

const cliente = new MongoClient(URI);

let baseDatos = null;

// Conectar con MongoDB
export async function conectarMongoDB() {
    if (baseDatos) {
        return baseDatos;
    }

    await cliente.connect();

    const db = cliente.db(NOMBRE_BD);
    await db.command({ ping: 1 });

    baseDatos = db;

    console.log('MongoDB conectado correctamente');

    return baseDatos;
}

// Obtener la base de datos
export function obtenerBaseDatos() {
    if (!baseDatos) {
        throw new Error('No se estableció la conexión con MongoDB');
    }

    return baseDatos;
}

// Cerrar la conexión
export async function cerrarMongoDB() {
    await cliente.close();
    baseDatos = null;
}
