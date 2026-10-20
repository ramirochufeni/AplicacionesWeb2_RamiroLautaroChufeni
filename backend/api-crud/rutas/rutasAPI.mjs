import express from 'express';
import rutasClientes from '../modulos/clientes/rutas.cliente.mjs';
import rutasServicios from '../modulos/servicios/rutas.servicio.mjs';
import rutasTurnos from '../modulos/turnos/rutas.turno.mjs';
import rutasProductos from '../modulos/productos/rutas.producto.mjs';
import rutasOrdenes from '../modulos/ordenes/rutas.orden.mjs';
import rutasUsuarios from '../modulos/usuarios/rutas.usuario.mjs';
import rutasAcceso from '../modulos/accesos/rutas.acceso.mjs';

const rutasAPI = express.Router();

// Conectar los modulos
rutasAPI.use(rutasClientes);
rutasAPI.use(rutasServicios);
rutasAPI.use(rutasTurnos);
rutasAPI.use(rutasProductos);
rutasAPI.use(rutasOrdenes);
rutasAPI.use(rutasUsuarios);
rutasAPI.use('/acceso', rutasAcceso);

export default rutasAPI;
