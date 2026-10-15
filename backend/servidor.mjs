import express from 'express';
import fs from 'node:fs';
import cors from 'cors';

const PUERTO = 3000;

const servidor = express();

servidor.use(cors());

servidor.use(express.json());

servidor.get('/', (peticion, respuesta) => {
    respuesta.send('Servidor funcionando correctamente');
});

// GET - Obtener todos los clientes
servidor.get('/clientes', (peticion, respuesta) => {
    const datos = fs.readFileSync('./clientes.json', 'utf-8');
    const clientes = JSON.parse(datos);

    respuesta.json(clientes);
});

// GET - Obtener todos los servicios
servidor.get('/servicios', (peticion, respuesta) => {
    const datos = fs.readFileSync('./servicios.json', 'utf-8');
    const servicios = JSON.parse(datos);

    respuesta.json(servicios);
});

// GET - Obtener todos los turnos
servidor.get('/turnos', (peticion, respuesta) => {
    const datos = fs.readFileSync('./turnos.json', 'utf-8');
    const turnos = JSON.parse(datos);

    respuesta.json(turnos);
});

// GET - Obtener un cliente por ID
servidor.get('/clientes/:id', (peticion, respuesta) => {
    const datos = fs.readFileSync('./clientes.json', 'utf-8');
    const clientes = JSON.parse(datos);

    const id = parseInt(peticion.params.id);

    const cliente = clientes.find(cliente => cliente.id === id);

    if (cliente) {
        respuesta.json(cliente);
    } else {
        respuesta.status(404).json({
            mensaje: 'Cliente no encontrado'
        });
    }
});

// POST - Crear un nuevo cliente
servidor.post('/clientes', (peticion, respuesta) => {
    const datos = fs.readFileSync('./clientes.json', 'utf-8');
    const clientes = JSON.parse(datos);

    const { nombre, apellido, email, telefono } = peticion.body;

    
    if (!nombre || !apellido || !email || !telefono) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    const nuevoId =
        clientes.length > 0
            ? Math.max(...clientes.map(cliente => cliente.id)) + 1
            : 1;

    const nuevoCliente = {
        id: nuevoId,
        nombre,
        apellido,
        email,
        telefono,
        activo: true
    };

    clientes.push(nuevoCliente);

    fs.writeFileSync(
        './clientes.json',
        JSON.stringify(clientes, null, 2)
    );

    respuesta.status(201).json({
        mensaje: 'Cliente creado correctamente',
        cliente: nuevoCliente
    });
});

// PUT - Actualizar un cliente existente
servidor.put('/clientes/:id', (peticion, respuesta) => {
    const datos = fs.readFileSync('./clientes.json', 'utf-8');
    const clientes = JSON.parse(datos);

    const id = parseInt(peticion.params.id);

    const {
        nombre,
        apellido,
        email,
        telefono,
        activo
    } = peticion.body;

    const indiceCliente = clientes.findIndex(
        cliente => cliente.id === id
    );

    if (indiceCliente === -1) {
        return respuesta.status(404).json({
            mensaje: 'Cliente no encontrado'
        });
    }

    if (!nombre || !apellido || !email || !telefono || activo === undefined) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    clientes[indiceCliente] = {
        id,
        nombre,
        apellido,
        email,
        telefono,
        activo
    };

    fs.writeFileSync(
        './clientes.json',
        JSON.stringify(clientes, null, 2)
    );

    respuesta.json({
        mensaje: 'Cliente actualizado correctamente',
        cliente: clientes[indiceCliente]
    });
});

// DELETE - Eliminar un cliente
servidor.delete('/clientes/:id', (peticion, respuesta) => {
    const datosClientes = fs.readFileSync('./clientes.json', 'utf-8');
    const clientes = JSON.parse(datosClientes);

    const datosTurnos = fs.readFileSync('./turnos.json', 'utf-8');
    const turnos = JSON.parse(datosTurnos);

    const id = parseInt(peticion.params.id);

    const cliente = clientes.find(cliente => cliente.id === id);

    if (!cliente) {
        return respuesta.status(404).json({
            mensaje: 'Cliente no encontrado'
        });
    }

    // Verificar si el cliente tiene turnos asociados
    const tieneTurnos = turnos.some(
        turno => turno.idCliente === id
    );

    if (tieneTurnos) {
        return respuesta.status(409).json({
            mensaje: 'No se puede eliminar el cliente porque tiene turnos asociados'
        });
    }

    // Eliminar cliente
    const clientesActualizados = clientes.filter(
        cliente => cliente.id !== id
    );

    fs.writeFileSync(
        './clientes.json',
        JSON.stringify(clientesActualizados, null, 2)
    );

    respuesta.json({
        mensaje: 'Cliente eliminado correctamente'
    });
});

// POST - Crear un nuevo turno
servidor.post('/turnos', (peticion, respuesta) => {
    const datosTurnos = fs.readFileSync('./turnos.json', 'utf-8');
    const turnos = JSON.parse(datosTurnos);

    const datosClientes = fs.readFileSync('./clientes.json', 'utf-8');
    const clientes = JSON.parse(datosClientes);

    const datosServicios = fs.readFileSync('./servicios.json', 'utf-8');
    const serviciosDisponibles = JSON.parse(datosServicios);

    const {
        idCliente,
        fecha,
        hora,
        equipo,
        servicios
    } = peticion.body;

    // Validar datos obligatorios
    if (
        !idCliente ||
        !fecha ||
        !hora ||
        !equipo ||
        !servicios ||
        servicios.length === 0
    ) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    const clienteExiste = clientes.find(
        cliente => cliente.id === idCliente
    );

    if (!clienteExiste) {
        return respuesta.status(404).json({
            mensaje: 'El cliente no existe'
        });
    }

    const serviciosEncontrados = serviciosDisponibles.filter(
        servicio => servicios.includes(servicio.id)
    );

    if (serviciosEncontrados.length !== servicios.length) {
        return respuesta.status(404).json({
            mensaje: 'Uno o más servicios no existen'
        });
    }

    const total = serviciosEncontrados.reduce(
        (acumulador, servicio) => acumulador + servicio.precio,
        0
    );

    const nuevoId =
        turnos.length > 0
            ? Math.max(...turnos.map(turno => turno.id)) + 1
            : 1001;

    const nuevoTurno = {
        id: nuevoId,
        idCliente,
        fecha,
        hora,
        equipo,
        servicios,
        total,
        pagado: false,
        finalizado: false
    };

    turnos.push(nuevoTurno);

    fs.writeFileSync(
        './turnos.json',
        JSON.stringify(turnos, null, 2)
    );

    respuesta.status(201).json({
        mensaje: 'Turno creado correctamente',
        turno: nuevoTurno
    });
});

// GET - Obtener productos y filtrar por categoría
servidor.get('/productos', (peticion, respuesta) => {
    const datos = fs.readFileSync('./productos.json', 'utf-8');
    const productos = JSON.parse(datos);

    const categoria = peticion.query.categoria;

    
    if (!categoria) {
        return respuesta.json(productos);
    }

    // Filtrar productos por categoría
    const productosFiltrados = productos.filter(
        producto =>
            producto.categoria.toLowerCase() === categoria.toLowerCase()
    );

    respuesta.json(productosFiltrados);
});

// POST - Crear una nueva orden de compra
servidor.post('/ordenes', (peticion, respuesta) => {
    const datosOrdenes = fs.readFileSync('./ordenes.json', 'utf-8');
    const ordenes = JSON.parse(datosOrdenes);

    const datosClientes = fs.readFileSync('./clientes.json', 'utf-8');
    const clientes = JSON.parse(datosClientes);

    const datosProductos = fs.readFileSync('./productos.json', 'utf-8');
    const productosDisponibles = JSON.parse(datosProductos);

    const {
        idCliente,
        productos
    } = peticion.body;

    // Validar datos obligatorios
    if (
        !idCliente ||
        !productos ||
        productos.length === 0
    ) {
        return respuesta.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    
    const clienteExiste = clientes.find(
        cliente => cliente.id === idCliente
    );

    if (!clienteExiste) {
        return respuesta.status(404).json({
            mensaje: 'El cliente no existe'
        });
    }

    let total = 0;
    const detalleProductos = [];

    // Verificar productos y stock
    for (const item of productos) {
        const producto = productosDisponibles.find(
            producto => producto.id === item.idProducto
        );

        if (!producto) {
            return respuesta.status(404).json({
                mensaje: `El producto ${item.idProducto} no existe`
            });
        }

        if (item.cantidad <= 0) {
            return respuesta.status(400).json({
                mensaje: 'La cantidad debe ser mayor a cero'
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

    // Descontar stock
    for (const item of productos) {
        const producto = productosDisponibles.find(
            producto => producto.id === item.idProducto
        );

        producto.stock -= item.cantidad;
    }

    // Generar ID de orden
    const nuevoId =
        ordenes.length > 0
            ? Math.max(...ordenes.map(orden => orden.id)) + 1
            : 1;

    const nuevaOrden = {
        id: nuevoId,
        idCliente,
        productos: detalleProductos,
        total,
        fecha: new Date().toISOString()
    };

    ordenes.push(nuevaOrden);

    // Guardar orden
    fs.writeFileSync(
        './ordenes.json',
        JSON.stringify(ordenes, null, 2)
    );

    // Actualizar stock
    fs.writeFileSync(
        './productos.json',
        JSON.stringify(productosDisponibles, null, 2)
    );

    respuesta.status(201).json({
        mensaje: 'Orden creada correctamente',
        orden: nuevaOrden
    });
});

// Iniciar servidor
servidor.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});