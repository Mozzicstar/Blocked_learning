import pg from 'pg';
import path from 'path';
import Database from 'better-sqlite3';

const { Pool } = pg;

// Determine database type and create pool
let pool: any;
let sqlite: any = null;
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL?.includes('postgresql');

if (isProduction || process.env.DATABASE_URL?.includes('postgresql')) {
  // Use PostgreSQL in production
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
} else {
  // Use SQLite in development
  const dbPath = process.env.DATABASE_URL || path.join('/tmp', 'blockedlearning.db');
  sqlite = new Database(dbPath);
  sqlite.pragma('foreign_keys = ON');
}

interface QueryResult {
  rows: any[];
  rowCount: number;
}

/**
 * Database client that works with both PostgreSQL and SQLite
 */
export const db = {
  query: async (sql: string, params?: any[]): Promise<QueryResult> => {
    try {
      if (pool) {
        // PostgreSQL
        const result = await pool.query(sql, params);
        return { rows: result.rows, rowCount: result.rowCount || 0 };
      } else if (sqlite) {
        // SQLite
        sql = sql.trim().replace(/;+$/, '');
        sql = sql.replace(/\$\d+/g, () => '?');

        if (sql.toUpperCase().startsWith('SELECT')) {
          const stmt = sqlite.prepare(sql);
          const rows = stmt.all(...(params || [])) as any[];
          return { rows, rowCount: rows.length };
        } else if (sql.toUpperCase().includes('RETURNING')) {
          const stmt = sqlite.prepare(sql);
          const result = stmt.run(...(params || []));
          
          const selectSql = sql.substring(0, sql.toUpperCase().indexOf('RETURNING')).trim();
          const table = selectSql.match(/INTO\s+(\w+)/i)?.[1] || selectSql.match(/UPDATE\s+(\w+)/i)?.[1];
          
          if (table && result.lastInsertRowid) {
            const fetchStmt = sqlite.prepare(`SELECT * FROM ${table} WHERE id = ?`);
            const rows = fetchStmt.all(result.lastInsertRowid) as any[];
            return { rows, rowCount: result.changes };
          }
          return { rows: [], rowCount: result.changes };
        } else {
          const stmt = sqlite.prepare(sql);
          const result = stmt.run(...(params || []));
          return { rows: [], rowCount: result.changes };
        }
      }
      return { rows: [], rowCount: 0 };
    } catch (error) {
      console.error('Database query error:', error, 'SQL:', sql, 'Params:', params);
      throw error;
    }
  }
};

/**
 * Initialize database schema
 */
export const initializeDatabase = async () => {
  try {
    console.log('🗄️  Initializing SQLite database...');

    // Create users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wallet TEXT UNIQUE NOT NULL,
        display_name TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add status column if it doesn't exist (for existing databases)
    try {
      sqlite.prepare('SELECT status FROM users LIMIT 1').get();
    } catch (e) {
      console.log('Adding status column to users table...');
      sqlite.exec('ALTER TABLE users ADD COLUMN status TEXT DEFAULT "active"');
    }

    // Create courses table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        creator_wallet TEXT NOT NULL,
        file_cid TEXT,
        ip_token_id TEXT,
        metadata_hash TEXT,
        tags TEXT,
        status TEXT DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_wallet) REFERENCES users(wallet)
      );
    `);

    // Create modules table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        title TEXT,
        resource_url TEXT,
        module_order INTEGER,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );
    `);

    // Create progress table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        module_id INTEGER,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
      );
    `);

    // Create trending table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS trending (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        summary TEXT,
        source TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

/**
 * Test database connection
 */
export const testConnection = async () => {
  try {
    sqlite.prepare('SELECT 1').get();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

export default db;
