-- Inizializzazione database Bandmate Harmony
-- Questo script viene eseguito automaticamente quando PostgreSQL si avvia

-- Crea le tabelle principali
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    instruments TEXT[] DEFAULT '{}',
    experience_level VARCHAR(50) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
    location VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    website_url VARCHAR(500),
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100) DEFAULT 'collaboration',
    event_date TIMESTAMP,
    location VARCHAR(255),
    instruments_needed TEXT[] DEFAULT '{}',
    max_participants INTEGER DEFAULT 10,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled', 'completed')),
    requirements TEXT,
    compensation VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_applications (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    message TEXT,
    applied_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP,
    UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_events_creator_id ON events(creator_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_event_applications_event_id ON event_applications(event_id);
CREATE INDEX IF NOT EXISTS idx_event_applications_user_id ON event_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Dati di test (opzionale - rimuovi in produzione)
INSERT INTO users (email, password_hash) VALUES 
('test@bandmate.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('musician@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;

-- Profili di test
INSERT INTO profiles (user_id, name, instruments, experience_level, location, bio) VALUES 
(1, 'Test User', ARRAY['guitar', 'vocals'], 'intermediate', 'Milano, Italy', 'Chitarrista e cantante, cerco band per progetti rock/pop'),
(2, 'Demo Musician', ARRAY['bass', 'piano'], 'advanced', 'Roma, Italy', 'Bassista con esperienza live, disponibile per collaborazioni')
ON CONFLICT DO NOTHING;

-- Eventi di test
INSERT INTO events (creator_id, title, description, event_date, location, instruments_needed, max_participants) VALUES 
(1, 'Cerco bassista per band rock', 'Stiamo formando una band rock e cerchiamo un bassista motivato per prove ed esibizioni.', NOW() + INTERVAL '7 days', 'Milano, Italy', ARRAY['bass'], 1),
(2, 'Serata jam session', 'Serata di musica insieme, tutti i livelli benvenuti!', NOW() + INTERVAL '3 days', 'Roma, Italy', ARRAY['guitar', 'drums', 'vocals'], 5)
ON CONFLICT DO NOTHING;

-- Messaggio di conferma
DO $$ 
BEGIN 
    RAISE NOTICE 'Database Bandmate Harmony inizializzato correttamente!';
    RAISE NOTICE 'Utenti di test: test@bandmate.com, musician@example.com (password: password)';
END $$;
