import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, u.display_name, u.email, u.phone, u.avatar_url
       FROM agents a JOIN users u ON a.user_id = u.id WHERE a.verified = true`
    );
    return NextResponse.json({ agents: rows });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}
