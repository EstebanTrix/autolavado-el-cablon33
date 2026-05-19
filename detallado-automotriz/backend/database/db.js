// backend/database/db.js
const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
    user: 'postgres',           // Es el usuario por defecto de Postgres
    host: 'localhost',          // Tu base de datos vive en tu PC
    database: 'detallado_automotriz', // El nombre de la DB que creaste en pgAdmin
    password: '220033',  // <--- ESCRIBE TU CONTRASEÑA AQUÍ
    port: 5432,                 // El puerto estándar de PostgreSQL
});

// Mensaje para confirmar en consola si la conexión funciona
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err.stack);
    } else {
        console.log('✅ Conexión exitosa a PostgreSQL - Hora del servidor:', res.rows[0].now);
    }
});

module.exports = pool;