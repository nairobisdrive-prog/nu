import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenRaw } from '@/lib/auth-helper';
import pool from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: { property_id: string } }) {
  try {
    const decoded = await verifyTokenRaw(req);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const [userRows]: any = await pool.execute('SELECT id FROM users WHERE firebase_uid = ?', [decoded.uid]);
    if (!userRows?.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await pool.execute('DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?', [userRows[0].id, params.property_id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove property' }, { status: 500 });
  }
}
