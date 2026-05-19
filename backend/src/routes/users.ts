import { Router } from 'express';
import pool from '../config/database.js';
import { auth as firebaseAuth } from '../config/firebase.js';

const router = Router();

// Middleware to verify Firebase token
async function verifyToken(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    req.firebaseUid = decoded.uid;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GET /api/users/profile — Get user profile
router.get('/profile', verifyToken, async (req: any, res) => {
  try {
    const [rows]: any = await pool.execute(
      'SELECT id, firebase_uid, email, display_name, phone, avatar_url, role, created_at FROM users WHERE firebase_uid = ?',
      [req.firebaseUid]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/users/profile — Update user profile
router.put('/profile', verifyToken, async (req: any, res) => {
  try {
    const { display_name, phone, avatar_url } = req.body;

    await pool.execute(
      'UPDATE users SET display_name = COALESCE(?, display_name), phone = COALESCE(?, phone), avatar_url = COALESCE(?, avatar_url) WHERE firebase_uid = ?',
      [display_name, phone, avatar_url, req.firebaseUid]
    );

    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/users/saved-properties — Get saved properties
router.get('/saved-properties', verifyToken, async (req: any, res) => {
  try {
    const [userRows]: any = await pool.execute(
      'SELECT id FROM users WHERE firebase_uid = ?',
      [req.firebaseUid]
    );

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].id;

    const [rows] = await pool.execute(
      `SELECT p.* FROM properties p
       JOIN saved_properties sp ON p.id = sp.property_id
       WHERE sp.user_id = ?
       ORDER BY sp.created_at DESC`,
      [userId]
    );

    res.json({ properties: rows });
  } catch (err) {
    console.error('Saved properties error:', err);
    res.status(500).json({ error: 'Failed to fetch saved properties' });
  }
});

// POST /api/users/saved-properties — Save a property
router.post('/saved-properties', verifyToken, async (req: any, res) => {
  try {
    const { property_id } = req.body;

    const [userRows]: any = await pool.execute(
      'SELECT id FROM users WHERE firebase_uid = ?',
      [req.firebaseUid]
    );

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].id;

    await pool.execute(
      'INSERT IGNORE INTO saved_properties (user_id, property_id) VALUES (?, ?)',
      [userId, property_id]
    );

    res.json({ success: true, message: 'Property saved' });
  } catch (err) {
    console.error('Save property error:', err);
    res.status(500).json({ error: 'Failed to save property' });
  }
});

// DELETE /api/users/saved-properties/:property_id — Unsave a property
router.delete('/saved-properties/:property_id', verifyToken, async (req: any, res) => {
  try {
    const { property_id } = req.params;

    const [userRows]: any = await pool.execute(
      'SELECT id FROM users WHERE firebase_uid = ?',
      [req.firebaseUid]
    );

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].id;

    await pool.execute(
      'DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?',
      [userId, property_id]
    );

    res.json({ success: true, message: 'Property removed from saved' });
  } catch (err) {
    console.error('Unsave property error:', err);
    res.status(500).json({ error: 'Failed to remove property' });
  }
});

// GET /api/users/saved-searches — Get saved searches
router.get('/saved-searches', verifyToken, async (req: any, res) => {
  try {
    const [userRows]: any = await pool.execute(
      'SELECT id FROM users WHERE firebase_uid = ?',
      [req.firebaseUid]
    );

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].id;

    const [rows] = await pool.execute(
      'SELECT * FROM saved_searches WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json({ searches: rows });
  } catch (err) {
    console.error('Saved searches error:', err);
    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
});

// POST /api/users/saved-searches — Save a search
router.post('/saved-searches', verifyToken, async (req: any, res) => {
  try {
    const { query_json } = req.body;

    const [userRows]: any = await pool.execute(
      'SELECT id FROM users WHERE firebase_uid = ?',
      [req.firebaseUid]
    );

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userRows[0].id;

    const [result]: any = await pool.execute(
      'INSERT INTO saved_searches (user_id, query_json) VALUES (?, ?)',
      [userId, JSON.stringify(query_json)]
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Save search error:', err);
    res.status(500).json({ error: 'Failed to save search' });
  }
});

export default router;
