import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [rows]: any = await pool.execute('SELECT * FROM properties WHERE id = ?', [id]);
    if (!rows?.length) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    const property = rows[0];
    if (property.agent_id) {
      const [agentRows]: any = await pool.execute(
        `SELECT a.*, u.display_name, u.email, u.phone, u.avatar_url
         FROM agents a JOIN users u ON a.user_id = u.id WHERE a.id = ?`,
        [property.agent_id]
      );
      if (agentRows?.length) property.agent = agentRows[0];
    }

    property.images   = typeof property.images   === 'string' ? JSON.parse(property.images)   : (property.images   || []);
    property.features = typeof property.features === 'string' ? JSON.parse(property.features) : (property.features || []);

    return NextResponse.json({ property });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const allowedFields = ['title','address','city','state','price','price_type','bedrooms','bathrooms',
      'sqft','property_type','images','description','features','year_built','parking','agent_id',
      'lat','lng','status','available_from','available_to','min_stay_nights','max_stay_nights'];

    const setClauses: string[] = [];
    const values: any[] = [];

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        values.push(['images','features'].includes(key) && Array.isArray(updates[key]) ? JSON.stringify(updates[key]) : updates[key]);
      }
    }

    if (!setClauses.length) return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    values.push(id);
    await pool.execute(`UPDATE properties SET ${setClauses.join(', ')} WHERE id = ?`, values);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.execute('DELETE FROM properties WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
