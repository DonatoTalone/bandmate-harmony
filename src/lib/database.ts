
import { Client } from 'pg';

// Database configuration
const dbConfig = {
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
  database: import.meta.env.VITE_DB_NAME || 'bandmate_harmony',
  user: import.meta.env.VITE_DB_USER || 'postgres',
  password: import.meta.env.VITE_DB_PASSWORD || 'your_password',
};

// Create database client
export const db = new Client(dbConfig);

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    await db.connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Database utility functions
export const query = async (text: string, params?: any[]) => {
  try {
    const result = await db.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
