import { Router } from 'express';
import pool from '../config/database.js';

const router = Router();

// GET /api/agents — List all agents
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, u.display_name, u.email, u.phone, u.avatar_url 
       FROM agents a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.verified = true`
    );
    res.json({ agents: rows });
  } catch (err) {
    console.error('Agents list error:', err);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
});

// GET /api/agents/:id — Get single agent with listings
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [agentRows]: any = await pool.execute(
      `SELECT a.*, u.display_name, u.email, u.phone, u.avatar_url 
       FROM agents a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.id = ?`,
      [id]
    );

    if (!agentRows || agentRows.length === 0) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agent = agentRows[0];

    // Get agent's listings
    const [listings] = await pool.execute(
      'SELECT * FROM properties WHERE agent_id = ? AND status = ? ORDER BY listed_date DESC',
      [id, 'active']
    );

    res.json({ agent: { ...agent, listings } });
  } catch (err) {
    console.error('Agent detail error:', err);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
});

export default router;
