-- Initialize Bandmate Harmony database schema

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    strumenti JSONB,
    bio TEXT,
    location VARCHAR(255),
    social_media JSONB,
    profile_image_url VARCHAR(500),
    impostazioni_privacy JSONB DEFAULT '{"profile_visibility": "public", "contact_visibility": "members"}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eventi table for musical events and opportunities
CREATE TABLE IF NOT EXISTS eventi (
    id SERIAL PRIMARY KEY,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    titolo VARCHAR(255) NOT NULL,
    descrizione TEXT,
    data DATE NOT NULL,
    ora_inizio TIME,
    ora_fine TIME,
    luogo VARCHAR(255) NOT NULL,
    tipo_evento VARCHAR(50), -- 'performance', 'rehearsal', 'collaboration', etc.
    tipo_organico VARCHAR(50),
    strumenti_richiesti JSONB,
    livello_skill VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    max_partecipanti INTEGER,
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'full', 'cancelled', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event applications table
CREATE TABLE IF NOT EXISTS event_applications (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES eventi(id) ON DELETE CASCADE,
    applicant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, applicant_id)
);

-- Reviews table for user feedback
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reviewed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES eventi(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(reviewer_id, reviewed_id, event_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_eventi_created_by ON eventi(created_by);
CREATE INDEX IF NOT EXISTS idx_eventi_data ON eventi(data);
CREATE INDEX IF NOT EXISTS idx_event_applications_event_id ON event_applications(event_id);
CREATE INDEX IF NOT EXISTS idx_event_applications_applicant_id ON event_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_id ON reviews(reviewed_id);