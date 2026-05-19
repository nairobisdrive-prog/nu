import { Router } from 'express';
import pool from '../config/database.js';

const router = Router();

// GET /api/admin/stats — Dashboard statistics
router.get('/stats', async (_req, res) => {
  try {
    const [[users]]: any = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [[agents]]: any = await pool.execute('SELECT COUNT(*) as count FROM agents');
    const [[properties]]: any = await pool.execute('SELECT COUNT(*) as count FROM properties');
    const [[activeProperties]]: any = await pool.execute("SELECT COUNT(*) as count FROM properties WHERE status = 'active'");
    const [[blogs]]: any = await pool.execute('SELECT COUNT(*) as count FROM blogs');
    const [[publishedBlogs]]: any = await pool.execute("SELECT COUNT(*) as count FROM blogs WHERE status = 'published'");

    res.json({
      stats: {
        totalUsers: users.count,
        totalAgents: agents.count,
        totalProperties: properties.count,
        activeProperties: activeProperties.count,
        totalBlogs: blogs.count,
        publishedBlogs: publishedBlogs.count,
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users — List all users
router.get('/users', async (req, res) => {
  try {
    const { limit = '50', offset = '0' } = req.query;

    const [rows] = await pool.execute(
      'SELECT id, firebase_uid, email, display_name, phone, avatar_url, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [parseInt(limit as string), parseInt(offset as string)]
    );

    res.json({ users: rows });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/role — Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await pool.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ success: true, message: 'Role updated' });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// GET /api/admin/properties — List all properties (including inactive)
router.get('/properties', async (req, res) => {
  try {
    const { limit = '50', offset = '0', status } = req.query;

    let sql = 'SELECT * FROM properties';
    const params: any[] = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY listed_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute(sql, params);
    res.json({ properties: rows });
  } catch (err) {
    console.error('Admin properties error:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/admin/blogs — List all blog posts (including drafts)
router.get('/blogs', async (req, res) => {
  try {
    const { limit = '50', offset = '0' } = req.query;

    const [rows] = await pool.execute(
      'SELECT id, title, slug, excerpt, featured_image, status, published_at, created_at FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [parseInt(limit as string), parseInt(offset as string)]
    );

    res.json({ posts: rows });
  } catch (err) {
    console.error('Admin blogs error:', err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

export default router;
