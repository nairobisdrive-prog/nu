import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const limit = parseInt(new URL(req.url).searchParams.get('limit') || '5');

    const [refRows]: any = await pool.execute(
      'SELECT city, price, bedrooms, property_type, price_type FROM properties WHERE id = ?', [id]
    );
    if (!refRows?.length) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    const ref = refRows[0];
    const [rows] = await pool.execute(
      `SELECT * FROM properties WHERE id != ? AND status = 'active'
       AND (city = ? OR price_type = ?) ORDER BY ABS(price - ?) ASC LIMIT ?`,
      [id, ref.city, ref.price_type, ref.price, limit]
    );

    const properties = (rows as any[]).map(p => ({
      ...p,
      images:   typeof p.images   === 'string' ? JSON.parse(p.images)   : (p.images   || []),
      features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || []),
    }));

    return NextResponse.json({ properties });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch similar properties' }, { status: 500 });
  }
}
