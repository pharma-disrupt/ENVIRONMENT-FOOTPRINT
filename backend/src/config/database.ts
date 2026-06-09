import { Pool, PoolClient } from 'pg';
import { env } from './env.js';
import { logger } from '../middleware/logger.js';

class Database {
  private pool: Pool | null = null;

  async connect(): Promise<void> {
    this.pool = new Pool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test connection
    const client = await this.pool.connect();
    try {
      await client.query('SELECT NOW()');
      logger.debug('Database connection test successful');
    } finally {
      client.release();
    }
  }

  async end(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      logger.info('Database connection closed');
    }
  }

  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }
    return this.pool.connect();
  }

  async query<T = any>(
    text: string,
    params?: any[]
  ): Promise<{ rows: T[]; rowCount: number | null }> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.debug(
        { text, duration, rows: result.rowCount },
        'Query executed'
      );
      
      return { rows: result.rows as T[], rowCount: result.rowCount };
    } catch (error) {
      logger.error({ text, error }, 'Query failed');
      throw error;
    }
  }

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export const db = new Database();
