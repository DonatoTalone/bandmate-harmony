const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db');
const authRoutes = require('./routes/authRoutes');
const bandRoutes = require('./routes/bandRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bands', bandRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);

// Initialize database tables at startup
async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS utenti (
        id SERIAL PRIMARY KEY,
        nome_utente VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        nome VARCHAR(255),
        cognome VARCHAR(255),
        data_nascita DATE,
        citta VARCHAR(255),
        bio TEXT,
        immagine_profilo VARCHAR(500),
        strumenti TEXT[],
        generi_musicali TEXT[],
        esperienza VARCHAR(50),
        disponibilita JSONB,
        contatti JSONB,
        creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        aggiornato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create eventi table  
    await pool.query(`
      CREATE TABLE IF NOT EXISTS eventi (
        id SERIAL PRIMARY KEY,
        titolo VARCHAR(255) NOT NULL,
        descrizione TEXT,
        data_evento TIMESTAMP NOT NULL,
        luogo VARCHAR(255),
        tipo_evento VARCHAR(100),
        genere_musicale VARCHAR(100),
        numero_partecipanti INTEGER DEFAULT 1,
        max_partecipanti INTEGER,
        creato_da INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
        creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        aggiornato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create partecipazioni_eventi table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS partecipazioni_eventi (
        id SERIAL PRIMARY KEY,
        evento_id INTEGER REFERENCES eventi(id) ON DELETE CASCADE,
        utente_id INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
        stato VARCHAR(50) DEFAULT 'confermato',
        messaggio TEXT,
        creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (evento_id, utente_id)
      );
    `);

    // Create messaggi table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messaggi (
        id SERIAL PRIMARY KEY,
        mittente_id INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
        destinatario_id INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
        contenuto TEXT NOT NULL,
        letto BOOLEAN DEFAULT false,
        creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create sessioni_utente table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessioni_utente (
        id SERIAL PRIMARY KEY,
        utente_id INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
        token VARCHAR(500) NOT NULL UNIQUE,
        creato_il TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        scade_il TIMESTAMP NOT NULL
      );
    `);

    console.log("✅ Database tables initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1);
  }
}

// Initialize database then start server
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
