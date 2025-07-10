const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Bandmate Harmony API is running' });
});

// Auth routes placeholder
app.post('/api/auth/register', async (req, res) => {
  // TODO: Implement user registration
  res.status(501).json({ message: 'Registration endpoint not implemented yet' });
});

app.post('/api/auth/login', async (req, res) => {
  // TODO: Implement user login
  res.status(501).json({ message: 'Login endpoint not implemented yet' });
});

// Profile routes placeholder
app.get('/api/profiles/:id', async (req, res) => {
  // TODO: Implement profile retrieval
  res.status(501).json({ message: 'Profile endpoint not implemented yet' });
});

app.put('/api/profiles/:id', async (req, res) => {
  // TODO: Implement profile update
  res.status(501).json({ message: 'Profile update endpoint not implemented yet' });
});

// Events routes placeholder
app.get('/api/events', async (req, res) => {
  // TODO: Implement events listing
  res.status(501).json({ message: 'Events endpoint not implemented yet' });
});

app.post('/api/events', async (req, res) => {
  // TODO: Implement event creation
  res.status(501).json({ message: 'Event creation endpoint not implemented yet' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Bandmate Harmony API server running on port ${port}`);
});