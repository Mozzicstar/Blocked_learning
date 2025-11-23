import Database from 'better-sqlite3';
import path from 'path';

// Create database in /tmp for dev environment
const dbPath = process.env.DATABASE_URL || path.join('/tmp', 'blockedlearning.db');
export const sqlite: any = new Database(dbPath);

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

interface QueryResult {
  rows: any[];
  rowCount: number;
}

/**
 * Mock pg Pool interface for compatibility
 */
export const db = {
  query: async (sql: string, params?: any[]): Promise<QueryResult> => {
    try {
      // Remove trailing semicolon if present
      sql = sql.trim().replace(/;+$/, '');

      // Convert PostgreSQL-style $1, $2 to SQLite-style ?
      sql = sql.replace(/\$\d+/g, () => '?');

      if (sql.toUpperCase().startsWith('SELECT')) {
        const stmt = sqlite.prepare(sql);
        const rows = stmt.all(...(params || [])) as any[];
        return { rows, rowCount: rows.length };
      } else if (sql.toUpperCase().includes('RETURNING')) {
        // Handle INSERT/UPDATE with RETURNING clause
        const stmt = sqlite.prepare(sql);
        const result = stmt.run(...(params || []));
        
        // For RETURNING, fetch the last inserted row
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

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
