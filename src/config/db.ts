// import { Pool } from 'pg';
// import dotenv from 'dotenv';
// dotenv.config();

// const dbPool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,  
//     port: Number(process.env.DB_PORT),
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// Pool.on('connect', ()=>{
//     console.log("Connected to the database");
// })

// Pool.on('error', (err: Error)=>{
//     console.error("Database connection error:", err);
//     Pool.exit(-1);
// })
// export const query = (text: string, params?: any[]) => dbPool.query(text, params);
// export default dbPool;

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Database features will not work.');
}

export const pool = connectionString
  ? new Pool({ connectionString })
  : (null as unknown as Pool);

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  if (!pool) throw new Error('Database not configured');
  const result = await pool.query(text, params);
  return result.rows as T[];
}
export async function checkConnection(): Promise<{ ok: boolean; error?: string }> {
  if (!pool) {
    return { ok: false, error: 'DATABASE_URL not set' };
  }
  try {
    await pool.query('SELECT 1');
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
