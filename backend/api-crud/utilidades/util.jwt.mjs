import jwt from 'jsonwebtoken';
import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Rutas de las claves RSA
const RUTA_CLAVE_PRIVADA = process.env.RSA_CLAVE_PRIVADA;
const RUTA_CLAVE_PUBLICA = process.env.RSA_CLAVE_PUBLICA;

// Crear y firmar un token
export function firmarToken(datos) {
    const clavePrivada = readFileSync(RUTA_CLAVE_PRIVADA);

    const token = jwt.sign(datos, clavePrivada, {
        algorithm: 'RS256',
        expiresIn: '30d'
    });

    return token;
}

// Verificar un token
export function verificarToken(token) {
    const clavePublica = readFileSync(RUTA_CLAVE_PUBLICA);

    try {
        const datos = jwt.verify(token, clavePublica, {
            algorithms: ['RS256']
        });

        return datos;

    } catch (error) {
        throw error;
    }
}
