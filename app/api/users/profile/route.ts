import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenRaw } from '@/lib/auth-helper';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const decoded = await verifyTokenRaw(req);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const [rows]: any = await pool.execute(
      'SELECT id, firebase_uid, email, display_name, phone, avatar_url, role, created_at FROM users WHERE firebase_uid = ?',
      [decoded.uid]
    );
    if (!rows?.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = await verifyTokenRaw(req);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { display_name, phone, avatar_url } = await req.json();
    await pool.execute(
      'UPDATE users SET display_name = COALESCE(?, display_name), phone = COALESCE(?, phone), avatar_url = COALESCE(?, avatar_url) WHERE firebase_uid = ?',
      [display_name, phone, avatar_url, decoded.uid]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
