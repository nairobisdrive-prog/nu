import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'srv554.hstgr.io',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'u973983966_xaan_rentals',
  user: process.env.DB_USER || 'u973983966_xaan_rentals',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false },
});

export default pool;
