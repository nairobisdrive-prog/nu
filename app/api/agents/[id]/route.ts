import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const [agentRows]: any = await pool.execute(
      `SELECT a.*, u.display_name, u.email, u.phone, u.avatar_url
       FROM agents a JOIN users u ON a.user_id = u.id WHERE a.id = ?`, [id]
    );
    if (!agentRows?.length) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    const [listings] = await pool.execute(
      `SELECT * FROM properties WHERE agent_id = ? AND status = 'active' ORDER BY listed_date DESC`, [id]
    );

    return NextResponse.json({ agent: { ...agentRows[0], listings } });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 });
  }
}
