import { Router } from 'express';
import pool from '../config/database.js';

const router = Router();

// GET /api/properties — List all properties with filters
router.get('/', async (req, res) => {
  try {
    const {
      price_type,
      city,
      state,
      property_type,
      min_price,
      max_price,
      bedrooms,
      bathrooms,
      status = 'active',
      limit = '50',
      offset = '0',
      sort = 'newest',
    } = req.query;

    let sql = 'SELECT * FROM properties WHERE 1=1';
    const params: any[] = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (price_type) {
      sql += ' AND price_type = ?';
      params.push(price_type);
    }
    if (city) {
      sql += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }
    if (state) {
      sql += ' AND state LIKE ?';
      params.push(`%${state}%`);
    }
    if (property_type) {
      sql += ' AND property_type = ?';
      params.push(property_type);
    }
    if (min_price) {
      sql += ' AND price >= ?';
      params.push(parseFloat(min_price as string));
    }
    if (max_price) {
      sql += ' AND price <= ?';
      params.push(parseFloat(max_price as string));
    }
    if (bedrooms) {
      sql += ' AND bedrooms >= ?';
      params.push(parseInt(bedrooms as string));
    }
    if (bathrooms) {
      sql += ' AND bathrooms >= ?';
      params.push(parseFloat(bathrooms as string));
    }

    // Sorting
    const sortMap: Record<string, string> = {
      newest: 'listed_date DESC',
      'price-low': 'price ASC',
      'price-high': 'price DESC',
      'beds-high': 'bedrooms DESC',
    };
    sql += ` ORDER BY ${sortMap[sort as string] || sortMap.newest}`;

    // Pagination
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute(sql, params);

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM properties WHERE 1=1';
    const countParams: any[] = [];
    if (status) { countSql += ' AND status = ?'; countParams.push(status); }
    if (price_type) { countSql += ' AND price_type = ?'; countParams.push(price_type); }
    if (city) { countSql += ' AND city LIKE ?'; countParams.push(`%${city}%`); }
    if (state) { countSql += ' AND state LIKE ?'; countParams.push(`%${state}%`); }
    if (property_type) { countSql += ' AND property_type = ?'; countParams.push(property_type); }
    if (min_price) { countSql += ' AND price >= ?'; countParams.push(parseFloat(min_price as string)); }
    if (max_price) { countSql += ' AND price <= ?'; countParams.push(parseFloat(max_price as string)); }
    if (bedrooms) { countSql += ' AND bedrooms >= ?'; countParams.push(parseInt(bedrooms as string)); }
    if (bathrooms) { countSql += ' AND bathrooms >= ?'; countParams.push(parseFloat(bathrooms as string)); }

    const [countResult]: any = await pool.execute(countSql, countParams);
    const total = countResult[0]?.total || 0;

    res.json({
      properties: rows,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: total > parseInt(offset as string) + parseInt(limit as string),
      },
    });
  } catch (err) {
    console.error('Properties list error:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id — Get single property
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.execute(
      'SELECT * FROM properties WHERE id = ?',
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Get agent info if property has agent_id
    const property = rows[0];
    if (property.agent_id) {
      const [agentRows]: any = await pool.execute(
        `SELECT a.*, u.display_name, u.email, u.phone, u.avatar_url 
         FROM agents a 
         JOIN users u ON a.user_id = u.id 
         WHERE a.id = ?`,
        [property.agent_id]
      );
      if (agentRows && agentRows.length > 0) {
        property.agent = agentRows[0];
      }
    }

    res.json({ property });
  } catch (err) {
    console.error('Property detail error:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// GET /api/properties/:id/similar — Get similar properties
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = '5' } = req.query;

    // Get the reference property
    const [refRows]: any = await pool.execute(
      'SELECT city, price, bedrooms, property_type, price_type FROM properties WHERE id = ?',
      [id]
    );

    if (!refRows || refRows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const ref = refRows[0];

    // Find similar properties
    const [rows] = await pool.execute(
      `SELECT * FROM properties 
       WHERE id != ? AND status = 'active' 
       AND (city = ? OR price_type = ?)
       ORDER BY ABS(price - ?) ASC
       LIMIT ?`,
      [id, ref.city, ref.price_type, ref.price, parseInt(limit as string)]
    );

    res.json({ properties: rows });
  } catch (err) {
    console.error('Similar properties error:', err);
    res.status(500).json({ error: 'Failed to fetch similar properties' });
  }
});

// POST /api/properties — Create new property (admin/agent only)
router.post('/', async (req, res) => {
  try {
    const {
      title, address, city, state, price, price_type,
      bedrooms, bathrooms, sqft, property_type,
      images, description, features, year_built,
      parking, agent_id, lat, lng,
      available_from, available_to, min_stay_nights, max_stay_nights,
    } = req.body;

    const [result]: any = await pool.execute(
      `INSERT INTO properties 
       (title, address, city, state, price, price_type, bedrooms, bathrooms, sqft, 
        property_type, images, description, features, year_built, parking, agent_id, 
        lat, lng, available_from, available_to, min_stay_nights, max_stay_nights)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, address, city, state, price, price_type,
        bedrooms, bathrooms, sqft, property_type,
        JSON.stringify(images || []), description, JSON.stringify(features || []),
        year_built || null, parking || 0, agent_id || null,
        lat || 0, lng || 0,
        available_from || null, available_to || null,
        min_stay_nights || null, max_stay_nights || null,
      ]
    );

    res.status(201).json({
      success: true,
      property: { id: result.insertId, ...req.body },
    });
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// PUT /api/properties/:id — Update property
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const allowedFields = [
      'title', 'address', 'city', 'state', 'price', 'price_type',
      'bedrooms', 'bathrooms', 'sqft', 'property_type', 'images',
      'description', 'features', 'year_built', 'parking', 'agent_id',
      'lat', 'lng', 'status', 'available_from', 'available_to',
      'min_stay_nights', 'max_stay_nights',
    ];

    const setClauses: string[] = [];
    const values: any[] = [];

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        setClauses.push(`${key} = ?`);
        values.push(
          ['images', 'features'].includes(key) && Array.isArray(updates[key])
            ? JSON.stringify(updates[key])
            : updates[key]
        );
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);
    await pool.execute(
      `UPDATE properties SET ${setClauses.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ success: true, message: 'Property updated' });
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// DELETE /api/properties/:id — Delete property
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM properties WHERE id = ?', [id]);
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;
