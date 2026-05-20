import { NextRequest } from 'next/server';
import { adminAuth } from './firebase-admin';
import pool from './db';

export async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    const [rows]: any = await pool.execute(
      'SELECT id, firebase_uid, email, display_name, role FROM users WHERE firebase_uid = ?',
      [decoded.uid]
    );
    return rows?.[0] || null;
  } catch {
    return null;
  }
}

export async function verifyTokenRaw(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const idToken = authHeader.split('Bearer ')[1];
  try {
    return await adminAuth.verifyIdToken(idToken);
  } catch {
    return null;
  }
}
