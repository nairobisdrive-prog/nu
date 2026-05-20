import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenRaw } from '@/lib/auth-helper';
import pool from '@/lib/db';

async function getUserId(uid: string): Promise<number | null> {
  const [rows]: any = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [uid]);
  return rows?.[0]?.id || null;
}

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyTokenRaw(req);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = await getUserId(decoded.uid);
    if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const [rows] = await pool.execute(
      `SELECT p.* FROM properties p JOIN saved_properties sp ON p.id = sp.property_id
       WHERE sp.user_id = ? ORDER BY sp.created_at DESC`, [userId]
    );
    return NextResponse.json({ properties: rows });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch saved properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyTokenRaw(req);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = await getUserId(decoded.uid);
    if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { property_id } = await req.json();
    await pool.execute('INSERT IGNORE INTO saved_properties (user_id, property_id) VALUES (?, ?)', [userId, property_id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save property' }, { status: 500 });
  }
}
