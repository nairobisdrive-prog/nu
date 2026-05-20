import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM blogs WHERE slug = ? AND status = ?', [params.slug, 'published']
    );
    if (!rows?.length) return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    return NextResponse.json({ post: rows[0] });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const updates = await req.json();
    const allowedFields = ['title','slug','excerpt','content','featured_image','status','tags','meta_title','meta_description'];
    const setClauses: string[] = [];
    const values: any[] = [];

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        values.push(key === 'tags' && Array.isArray(updates[key]) ? JSON.stringify(updates[key]) : updates[key]);
      }
    }
    if (updates.status === 'published') { setClauses.push('published_at = ?'); values.push(new Date().toISOString()); }
    if (!setClauses.length) return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });

    values.push(params.slug);
    await pool.execute(`UPDATE blogs SET ${setClauses.join(', ')} WHERE slug = ?`, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await pool.execute('DELETE FROM blogs WHERE slug = ?', [params.slug]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
