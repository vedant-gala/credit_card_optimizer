import { Pool } from 'pg';
import { logger } from '@/utils/logger';

// TODO : Smart host detection
// const isDocker = process.env['DOCKER'] === 'true' || process.env['NODE_ENV'] === 'docker';
// const dbHost = isDocker ? 'postgres' : 'localhost';
// const redisHost = isDocker ? 'redis' : 'localhost';
// Build connection string dynamically to solve for Docker or not-Docker
// const DATABASE_URL = "postgresql://" + process.env['DB_USER'] + ":" + process.env['DB_PASSWORD'] + "@" + dbHost + ":" + process.env['DB_PORT'] + "/" + process.env['DB_NAME'];

// TODO : Figure out why DatabaseURL doesn't work directly when running outside of Docker
//const pool = new Pool({
//  connectionString: process.env['DATABASE_URL'],
//  max: 20, 
//  idleTimeoutMillis: 30000,
// connectionTimeoutMillis: 2000,
//});

const pool = new Pool({
  user: 'postgres',
  password: 'password',
  host: 'localhost',     // ← Use localhost, not 'postgres'
  port: 5432,            // ← Docker-exposed port
  database: 'credit_card_optimizer',
});

export async function connectDatabase(): Promise<void> {
  try {
    console.log('Database connection string:', process.env['DATABASE_URL']);
    console.log('Environment Variable Debug:');
    console.log('   DATABASE_URL:', process.env['DATABASE_URL']);
    console.log('   DB_HOST:', process.env['DB_HOST']);
    console.log('   DB_PORT:', process.env['DB_PORT']);
    console.log('   DB_NAME:', process.env['DB_NAME']);
    console.log('   DB_USER:', process.env['DB_USER']);
    console.log('   DB_PASSWORD:', process.env['DB_PASSWORD']);
    console.log('   DB_PASSWORD_SET:', process.env['DB_PASSWORD'] ? '[SET]' : '[NOT SET]');
    console.log('   Password type:', typeof process.env['DB_PASSWORD']);
    console.log('   NODE_ENV:', process.env['NODE_ENV']);

    const client = await pool.connect();
    logger.info('Database connection established');
    client.release();
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function query(text: string, params?: any[]): Promise<any> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('Query error:', error);
    throw error;
  }
}

export async function getClient(): Promise<any> {
  return await pool.connect();
}

export default pool; 