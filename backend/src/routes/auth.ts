import { Router } from 'express';
import pool from '../config/database.js';
import { auth as firebaseAuth } from '../config/firebase.js';

const router = Router();

// POST /api/auth/verify — Verify Firebase ID token and sync user to DB
router.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID token required' });
    }

    // Verify Firebase token
    let decoded;
    try {
      decoded = await firebaseAuth.verifyIdToken(idToken);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token', details: (err as Error).message });
    }

    const firebaseUid = decoded.uid;
    const email = decoded.email || '';
    const displayName = decoded.name || null;
    const avatarUrl = decoded.picture || null;

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT * FROM users WHERE firebase_uid = ?',
      [firebaseUid]
    );

    let userId: number;
    let userRole: string;
    if (Array.isArray(existing) && existing.length > 0) {
      // Update last login info
      const existingUser = existing[0] as any;
      userId = existingUser.id;
      userRole = existingUser.role;
      await pool.execute(
        'UPDATE users SET display_name = COALESCE(?, display_name), avatar_url = COALESCE(?, avatar_url) WHERE firebase_uid = ?',
        [displayName, avatarUrl, firebaseUid]
      );
    } else {
      // Create new user
      const [result]: any = await pool.execute(
        'INSERT INTO users (firebase_uid, email, display_name, avatar_url, role) VALUES (?, ?, ?, ?, ?)',
        [firebaseUid, email, displayName, avatarUrl, 'user']
      );
      userId = result.insertId;
      userRole = 'user';
    }

    res.json({
      success: true,
      user: {
        id: userId,
        firebase_uid: firebaseUid,
        email,
        display_name: displayName,
        avatar_url: avatarUrl,
        role: userRole,
      },
    });
  } catch (err) {
    console.error('Auth verify error:', err);
    res.status(500).json({ error: 'Authentication failed', details: (err as Error).message });
  }
});

// GET /api/auth/me — Get current user profile
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decoded;
    try {
      decoded = await firebaseAuth.verifyIdToken(idToken);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const [rows]: any = await pool.execute(
      'SELECT id, firebase_uid, email, display_name, phone, avatar_url, role, created_at FROM users WHERE firebase_uid = ?',
      [decoded.uid]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Auth me error:', err);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

export default router;
