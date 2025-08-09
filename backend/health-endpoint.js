// Aggiungi questo al tuo backend server (server.js o app.js)

// Health check endpoint - deve essere aggiunto prima degli altri routes
app.get('/api/health', async (req, res) => {
    try {
        // Test connessione database
        await pool.query('SELECT 1');
        res.status(200).json({ 
            status: 'healthy', 
            database: 'connected',
            timestamp: new Date().toISOString(),
            service: 'bandmate-harmony-backend'
        });
    } catch (error) {
        res.status(503).json({ 
            status: 'unhealthy', 
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Esempio di connessione database con retry (se non l'hai già)
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Funzione per aspettare il database
async function connectWithRetry() {
    const maxRetries = 10;
    const retryDelay = 3000; // 3 secondi
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            await pool.query('SELECT NOW()');
            console.log('✅ Database connesso con successo!');
            return;
        } catch (error) {
            console.log(`❌ Tentativo ${i + 1}/${maxRetries} di connessione al database fallito:`, error.message);
            
            if (i === maxRetries - 1) {
                throw new Error(`Impossibile connettersi al database dopo ${maxRetries} tentativi`);
            }
            
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
}

// Avvia il server solo dopo la connessione al database
async function startServer() {
    try {
        await connectWithRetry();
        
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Backend server in esecuzione sulla porta ${PORT}`);
        });
    } catch (error) {
        console.error('💥 Errore nell\'avvio del server:', error);
        process.exit(1);
    }
}

// Avvia il server
startServer();
