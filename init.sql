
-- Initialize database schema for Bandmate Harmony
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    nome_arte VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    citta VARCHAR(100),
    raggio_attivita INTEGER DEFAULT 50,
    bio TEXT,
    foto_profile TEXT,
    social_media JSONB,
    strumenti JSONB,
    impostazioni_privacy JSONB DEFAULT '{"telefono": "privato", "email": "privato", "disponibilita": "pubblico", "accettaRecensioni": true}',
    data_registrazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create eventi table
CREATE TABLE IF NOT EXISTS eventi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizzatore_id UUID NOT NULL,
    titolo VARCHAR(200) NOT NULL,
    descrizione TEXT,
    data DATE NOT NULL,
    ora_inizio TIME NOT NULL,
    ora_fine TIME NOT NULL,
    luogo VARCHAR(255) NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    tipo_organico VARCHAR(50),
    strumenti_richiesti JSONB,
    stato VARCHAR(20) DEFAULT 'Aperto',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create disponibilita table
CREATE TABLE IF NOT EXISTS disponibilita (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    data DATE NOT NULL,
    ora_inizio TIME NOT NULL,
    ora_fine TIME NOT NULL,
    descrizione TEXT,
    attiva BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_eventi_organizzatore ON eventi(organizzatore_id);
CREATE INDEX IF NOT EXISTS idx_eventi_data ON eventi(data);
CREATE INDEX IF NOT EXISTS idx_disponibilita_user ON disponibilita(user_id);
CREATE INDEX IF NOT EXISTS idx_disponibilita_data ON disponibilita(data);

-- Add foreign key constraints
ALTER TABLE eventi ADD CONSTRAINT fk_eventi_organizzatore 
    FOREIGN KEY (organizzatore_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE disponibilita ADD CONSTRAINT fk_disponibilita_user 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
