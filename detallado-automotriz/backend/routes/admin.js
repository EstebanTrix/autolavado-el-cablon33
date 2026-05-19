const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Obtener todas las órdenes pendientes
router.get('/dashboard', async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id_orden,
                c.nombre AS cliente,
                c.marca_auto || ' ' || c.modelo_auto AS vehiculo,
                c.placa,
                STRING_AGG(d.nombre_servicio, ', ') AS servicios,
                o.total,
                o.estado,
                TO_CHAR(o.fecha_orden, 'DD/MM HH24:MI') as fecha
            FROM orden o
            JOIN cliente c ON o.id_cliente = c.id_cliente
            JOIN detalle_orden d ON o.id_orden = d.id_orden
            WHERE o.estado = 'pendiente'
            GROUP BY o.id_orden, c.nombre, c.marca_auto, c.modelo_auto, c.placa, o.total, o.estado
            ORDER BY o.id_orden ASC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cambiar estado a completada
router.put('/orden/:id/completar', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("UPDATE orden SET estado = 'completada' WHERE id_orden = $1", [id]);
        res.json({ message: "Orden completada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;