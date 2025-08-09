const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Helpers
const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

async function getUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM utenti WHERE email = $1 LIMIT 1', [email]);
  return rows[0] || null;
}

async function getUserById(id) {
  const { rows } = await pool.query('SELECT * FROM utenti WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { email, password, nome, cognome } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // derive username from email
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').slice(0, 24) || 'user';
    let nome_utente = baseUsername;
    let suffix = 0;
    // ensure unique username
    // Note: loop limited to avoid infinite
    // Try a few attempts to find a free username
    for (let i = 0; i < 10; i++) {
      const { rows } = await pool.query('SELECT 1 FROM utenti WHERE nome_utente = $1', [nome_utente]);
      if (rows.length === 0) break;
      suffix += 1;
      nome_utente = `${baseUsername}_${suffix}`;
    }

    const insertQuery = `
      INSERT INTO utenti (nome_utente, email, password, nome, cognome)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome_utente, email, nome, cognome, citta, bio, immagine_profilo, strumenti, generi_musicali, esperienza, disponibilita, contatti, creato_il, aggiornato_il;
    `;
    const { rows } = await pool.query(insertQuery, [nome_utente, email, hash, nome || null, cognome || null]);
    const user = rows[0];
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    // remove password from response
    delete user.password;
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load user' });
  }
});

// POST /logout (stateless)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true });
});

module.exports = router;
