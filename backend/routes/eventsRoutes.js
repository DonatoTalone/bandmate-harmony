const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET / - list events
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titolo, descrizione, data_evento AS data, luogo, tipo_evento
       FROM eventi ORDER BY data_evento DESC`
    );

    // Ensure fields expected by frontend exist
    const events = rows.map((e) => ({
      id: e.id,
      titolo: e.titolo,
      descrizione: e.descrizione || '',
      data: e.data,
      oraInizio: null,
      oraFine: null,
      luogo: e.luogo || null,
      tipoEvento: e.tipo_evento || null,
      tipoOrganico: null,
      strumentiRichiesti: null,
    }));

    res.json(events);
  } catch (error) {
    console.error('List events error:', error);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

// POST / - create event
router.post('/', async (req, res) => {
  try {
    const { titolo, descrizione, data, luogo, tipo_evento } = req.body || {};
    if (!titolo || !data) return res.status(400).json({ error: 'titolo and data are required' });

    const { rows } = await pool.query(
      `INSERT INTO eventi (titolo, descrizione, data_evento, luogo, tipo_evento)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, titolo, descrizione, data_evento AS data, luogo, tipo_evento`,
      [titolo, descrizione || null, data, luogo || null, tipo_evento || null]
    );

    const e = rows[0];
    const created = {
      id: e.id,
      titolo: e.titolo,
      descrizione: e.descrizione || '',
      data: e.data,
      oraInizio: null,
      oraFine: null,
      luogo: e.luogo || null,
      tipoEvento: e.tipo_evento || null,
      tipoOrganico: null,
      strumentiRichiesti: null,
    };

    res.status(201).json(created);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

module.exports = router;
