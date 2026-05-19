const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del estanque de conexiones seguro
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'el_cablon_33',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// ENDPOINT: Procesamiento Transaccional de Órdenes con Regla de Negocio
app.post('/api/ordenes', async (req, res) => {
  const { nombre, telefono, correo, marca, modelo, placa, fecha, vehiculo, total, servicios } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Inicio de bloque transaccional atómico

    // 1. Validar Cupo Semanal (Límite estricto de 5 autos)
    const queryControl = `
      SELECT COUNT(*) FROM orden 
      WHERE date_trunc('week', fecha_orden) = date_trunc('week', CURRENT_DATE);
    `;
    const checkRes = await client.query(queryControl);
    const autosEstaSemana = parseInt(checkRes.rows[0].count);

    if (autosEstaSemana >= 5) {
      await client.query('ROLLBACK'); // Abortar flujo
      return res.status(400).json({ 
        status: 'full', 
        message: 'Agenda saturada. Solo aceptamos 5 autos por semana. Tu cita puede agendarse hasta la próxima semana.' 
      });
    }

    // 2. Insertar Entidad Cliente
    const resCliente = await client.query(
      'INSERT INTO cliente (nombre, telefono, correo) VALUES ($1, $2, $3) RETURNING id_cliente',
      [nombre, telefono, correo]
    );
    const idCliente = resCliente.rows[0].id_cliente;

    // 3. Insertar Entidad Orden
    const resOrden = await client.query(
      'INSERT INTO orden (id_cliente, tipo_vehiculo, marca, modelo, placa, fecha_preferida, total) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_orden',
      [idCliente, vehiculo, marca, modelo, placa, fecha ? fecha : null, total]
    );
    const idOrden = resOrden.rows[0].id_orden;

    // 4. Registrar Relaciones en la Tabla Intermedia
    if (servicios && servicios.length > 0) {
      for (let idServicio of servicios) {
        await client.query(
          'INSERT INTO detalle_orden (id_orden, id_servicio) VALUES ($1, $2)',
          [idOrden, idServicio]
        );
      }
    }

    await client.query('COMMIT'); // Confirmar cambios en la BD
    res.status(200).json({ status: 'success', id_orden: idOrden, cliente: nombre });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error crítico en el proceso de orden:', error);
    res.status(500).json({ status: 'error', message: 'Fallo interno al procesar el registro.' });
  } finally {
    client.release(); // Liberación de la conexión al pool
  }
});

// ENDPOINT: Registro de Encuestas de Calidad (Reseñas)
app.post('/api/resenas', async (req, res) => {
  const { id_orden, calificacion, comentario } = req.body;
  try {
    await pool.query(
      'INSERT INTO resena (id_orden, calificacion, comentario) VALUES ($1, $2, $3)',
      [id_orden, calificacion, comentario]
    );
    res.status(200).json({ status: 'success', message: 'Evaluación guardada con éxito.' });
  } catch (error) {
    console.error('Error al insertar reseña:', error);
    res.status(500).json({ status: 'error', message: 'No se pudo procesar la calificación.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en ejecución sobre el puerto ${PORT}`));