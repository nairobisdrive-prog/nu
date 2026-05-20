import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return NextResponse.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ status: 'error', database: 'disconnected', error: (err as Error).message }, { status: 500 });
  }
}
