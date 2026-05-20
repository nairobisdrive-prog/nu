import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tag    = searchParams.get('tag');
    const search = searchParams.get('search');
    const limit  = parseInt(searchParams.get('limit')  || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = `SELECT id, title, slug, excerpt, featured_image, author_id, published_at, tags,
               meta_title, meta_description, created_at FROM blogs WHERE status = ?`;
    const params: any[] = ['published'];

    if (tag)    { sql += ' AND JSON_CONTAINS(tags, ?)';                params.push(JSON.stringify(tag)); }
    if (search) { sql += ' AND (title LIKE ? OR excerpt LIKE ?)';      params.push(`%${search}%`, `%${search}%`); }
    sql += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(sql, params);

    let countSql = 'SELECT COUNT(*) as total FROM blogs WHERE status = ?';
    const cp: any[] = ['published'];
    if (tag)    { countSql += ' AND JSON_CONTAINS(tags, ?)';           cp.push(JSON.stringify(tag)); }
    if (search) { countSql += ' AND (title LIKE ? OR excerpt LIKE ?)'; cp.push(`%${search}%`, `%${search}%`); }

    const [countResult]: any = await pool.execute(countSql, cp);
    return NextResponse.json({ posts: rows, pagination: { total: countResult[0]?.total || 0, limit, offset } });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, slug, excerpt, content, featured_image, author_id, tags, meta_title, meta_description, status = 'draft' } = await req.json();
    const [result]: any = await pool.execute(
      `INSERT INTO blogs (title, slug, excerpt, content, featured_image, author_id, status, tags, meta_title, meta_description, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, excerpt, content, featured_image, author_id, status,
       JSON.stringify(tags || []), meta_title || null, meta_description || null,
       status === 'published' ? new Date().toISOString() : null]
    );
    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
