import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const price_type    = searchParams.get('price_type');
    const city          = searchParams.get('city');
    const state         = searchParams.get('state');
    const property_type = searchParams.get('property_type');
    const min_price     = searchParams.get('min_price');
    const max_price     = searchParams.get('max_price');
    const bedrooms      = searchParams.get('bedrooms');
    const bathrooms     = searchParams.get('bathrooms');
    const status        = searchParams.get('status') || 'active';
    const limit         = parseInt(searchParams.get('limit')  || '50');
    const offset        = parseInt(searchParams.get('offset') || '0');
    const sort          = searchParams.get('sort') || 'newest';

    let sql = 'SELECT * FROM properties WHERE 1=1';
    const params: any[] = [];

    if (status)        { sql += ' AND status = ?';         params.push(status); }
    if (price_type)    { sql += ' AND price_type = ?';     params.push(price_type); }
    if (city)          { sql += ' AND city LIKE ?';        params.push(`%${city}%`); }
    if (state)         { sql += ' AND state LIKE ?';       params.push(`%${state}%`); }
    if (property_type) { sql += ' AND property_type = ?';  params.push(property_type); }
    if (min_price)     { sql += ' AND price >= ?';         params.push(parseFloat(min_price)); }
    if (max_price)     { sql += ' AND price <= ?';         params.push(parseFloat(max_price)); }
    if (bedrooms)      { sql += ' AND bedrooms >= ?';      params.push(parseInt(bedrooms)); }
    if (bathrooms)     { sql += ' AND bathrooms >= ?';     params.push(parseFloat(bathrooms)); }

    const sortMap: Record<string, string> = {
      newest:      'listed_date DESC',
      'price-low':  'price ASC',
      'price-high': 'price DESC',
      'beds-high':  'bedrooms DESC',
    };
    sql += ` ORDER BY ${sortMap[sort] || sortMap.newest} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.execute(sql, params);

    let countSql = 'SELECT COUNT(*) as total FROM properties WHERE 1=1';
    const cp: any[] = [];
    if (status)        { countSql += ' AND status = ?';        cp.push(status); }
    if (price_type)    { countSql += ' AND price_type = ?';    cp.push(price_type); }
    if (city)          { countSql += ' AND city LIKE ?';       cp.push(`%${city}%`); }
    if (state)         { countSql += ' AND state LIKE ?';      cp.push(`%${state}%`); }
    if (property_type) { countSql += ' AND property_type = ?'; cp.push(property_type); }
    if (min_price)     { countSql += ' AND price >= ?';        cp.push(parseFloat(min_price)); }
    if (max_price)     { countSql += ' AND price <= ?';        cp.push(parseFloat(max_price)); }
    if (bedrooms)      { countSql += ' AND bedrooms >= ?';     cp.push(parseInt(bedrooms)); }
    if (bathrooms)     { countSql += ' AND bathrooms >= ?';    cp.push(parseFloat(bathrooms)); }

    const [countResult]: any = await pool.execute(countSql, cp);
    const total = countResult[0]?.total || 0;

    const properties = (rows as any[]).map(p => ({
      ...p,
      images:   typeof p.images   === 'string' ? JSON.parse(p.images)   : (p.images   || []),
      features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || []),
    }));

    return NextResponse.json({ properties, pagination: { total, limit, offset, hasMore: total > offset + limit } });
  } catch (err) {
    console.error('Properties list error:', err);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, address, city, state, price, price_type, bedrooms, bathrooms, sqft,
            property_type, images, description, features, year_built, parking, agent_id,
            lat, lng, available_from, available_to, min_stay_nights, max_stay_nights } = body;

    const [result]: any = await pool.execute(
      `INSERT INTO properties (title, address, city, state, price, price_type, bedrooms, bathrooms, sqft,
        property_type, images, description, features, year_built, parking, agent_id,
        lat, lng, available_from, available_to, min_stay_nights, max_stay_nights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, address, city, state, price, price_type, bedrooms, bathrooms, sqft,
       property_type, JSON.stringify(images || []), description, JSON.stringify(features || []),
       year_built || null, parking || 0, agent_id || null, lat || 0, lng || 0,
       available_from || null, available_to || null, min_stay_nights || null, max_stay_nights || null]
    );

    return NextResponse.json({ success: true, property: { id: result.insertId, ...body } }, { status: 201 });
  } catch (err) {
    console.error('Create property error:', err);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
