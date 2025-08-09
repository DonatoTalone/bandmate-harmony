const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /:id - get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT id, nome, cognome, nome_utente, email, citta, bio, immagine_profilo,
              strumenti, generi_musicali, esperienza, disponibilita, contatti
       FROM utenti WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Profile not found' });

    const u = rows[0];
    const profile = {
      id: u.id,
      nome: u.nome,
      cognome: u.cognome,
      nome_arte: null, // not available in schema
      email: u.email,
      citta: u.citta,
      bio: u.bio,
      immagine_profilo: u.immagine_profilo,
      strumenti: u.strumenti || [],
      generi_musicali: u.generi_musicali || [],
      esperienza: u.esperienza || null,
      disponibilita: u.disponibilita || null,
      contatti: u.contatti || null,
    };

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// PUT /:id - update profile fields
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ['nome', 'cognome', 'citta', 'bio', 'immagine_profilo', 'strumenti', 'generi_musicali', 'esperienza', 'disponibilita', 'contatti'];
    const updates = req.body || {};

    const setParts = [];
    const values = [];
    let idx = 1;
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        setParts.push(`${key} = $${idx}`);
        values.push(updates[key]);
        idx++;
      }
    }

    if (setParts.length === 0) return res.status(400).json({ error: 'No valid fields to update' });

    values.push(id);
    const query = `UPDATE utenti SET ${setParts.join(', ')}, aggiornato_il = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`;
    const { rows } = await pool.query(query, values);
    const user = rows[0];

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
