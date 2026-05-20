import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: 'ID token required' }, { status: 400 });

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token', details: (err as Error).message }, { status: 401 });
    }

    const { uid: firebaseUid, email = '', name: displayName = null, picture: avatarUrl = null } = decoded;

    const [existing]: any = await pool.execute('SELECT * FROM users WHERE firebase_uid = ?', [firebaseUid]);

    let userId: number;
    let userRole: string;

    if (Array.isArray(existing) && existing.length > 0) {
      userId = existing[0].id;
      userRole = existing[0].role;
      await pool.execute(
        'UPDATE users SET display_name = COALESCE(?, display_name), avatar_url = COALESCE(?, avatar_url) WHERE firebase_uid = ?',
        [displayName, avatarUrl, firebaseUid]
      );
    } else {
      const [result]: any = await pool.execute(
        'INSERT INTO users (firebase_uid, email, display_name, avatar_url, role) VALUES (?, ?, ?, ?, ?)',
        [firebaseUid, email, displayName, avatarUrl, 'user']
      );
      userId = result.insertId;
      userRole = 'user';
    }

    return NextResponse.json({ success: true, user: { id: userId, firebase_uid: firebaseUid, email, display_name: displayName, avatar_url: avatarUrl, role: userRole } });
  } catch (err) {
    console.error('Auth verify error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
