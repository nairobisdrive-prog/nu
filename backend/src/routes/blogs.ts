import { Router } from 'express';
import pool from '../config/database.js';

const router = Router();

// GET /api/blogs — List published blog posts
router.get('/', async (req, res) => {
  try {
    const { tag, search, limit = '20', offset = '0' } = req.query;

    let sql = 'SELECT id, title, slug, excerpt, featured_image, author_id, published_at, tags, meta_title, meta_description, created_at FROM blogs WHERE status = ?';
    const params: any[] = ['published'];

    if (tag) {
      sql += ' AND JSON_CONTAINS(tags, ?)';
      params.push(JSON.stringify(tag));
    }

    if (search) {
      sql += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute(sql, params);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM blogs WHERE status = ?';
    const countParams: any[] = ['published'];
    if (tag) { countSql += ' AND JSON_CONTAINS(tags, ?)'; countParams.push(JSON.stringify(tag)); }
    if (search) { countSql += ' AND (title LIKE ? OR excerpt LIKE ?)'; countParams.push(`%${search}%`, `%${search}%`); }

    const [countResult]: any = await pool.execute(countSql, countParams);
    const total = countResult[0]?.total || 0;

    res.json({
      posts: rows,
      pagination: { total, limit: parseInt(limit as string), offset: parseInt(offset as string) },
    });
  } catch (err) {
    console.error('Blog list error:', err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET /api/blogs/:slug — Get single blog post
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows]: any = await pool.execute(
      'SELECT * FROM blogs WHERE slug = ? AND status = ?',
      [slug, 'published']
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ post: rows[0] });
  } catch (err) {
    console.error('Blog detail error:', err);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// POST /api/blogs — Create blog post (admin only)
router.post('/', async (req, res) => {
  try {
    const {
      title, slug, excerpt, content, featured_image,
      author_id, tags, meta_title, meta_description,
      status = 'draft',
    } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO blogs (title, slug, excerpt, content, featured_image, author_id, status, tags, meta_title, meta_description, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, slug, excerpt, content, featured_image,
        author_id, status,
        JSON.stringify(tags || []),
        meta_title || null,
        meta_description || null,
        status === 'published' ? new Date().toISOString() : null,
      ]
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Create blog error:', err);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// PUT /api/blogs/:id — Update blog post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['title', 'slug', 'excerpt', 'content', 'featured_image', 'status', 'tags', 'meta_title', 'meta_description'];
    const setClauses: string[] = [];
    const values: any[] = [];

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        values.push(key === 'tags' && Array.isArray(updates[key]) ? JSON.stringify(updates[key]) : updates[key]);
      }
    }

    if (updates.status === 'published') {
      setClauses.push('published_at = ?');
      values.push(new Date().toISOString());
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);
    await pool.execute(
      `UPDATE blogs SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ success: true, message: 'Blog post updated' });
  } catch (err) {
    console.error('Update blog error:', err);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// DELETE /api/blogs/:id — Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (err) {
    console.error('Delete blog error:', err);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;
