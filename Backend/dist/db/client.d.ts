interface QueryResult {
    rows: any[];
    rowCount: number;
}
/**
 * Database client that works with both PostgreSQL and SQLite
 */
export declare const db: {
    query: (sql: string, params?: any[]) => Promise<QueryResult>;
};
/**
 * Initialize database schema
 */
export declare const initializeDatabase: () => Promise<void>;
/**
 * Test database connection
 */
export declare const testConnection: () => Promise<boolean>;
export default db;
//# sourceMappingURL=client.d.ts.map