import { Request, Response, NextFunction } from 'express';
import { auth as firebaseAuth } from '../config/firebase.js';
import pool from '../config/database.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        firebase_uid: string;
        email: string;
        display_name: string | null;
        role: 'user' | 'agent' | 'admin';
      };
    }
  }
}

// Verify Firebase token and attach user to request
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await firebaseAuth.verifyIdToken(idToken);

    // Get user from database
    const [rows]: any = await pool.execute(
      'SELECT id, firebase_uid, email, display_name, role FROM users WHERE firebase_uid = ?',
      [decoded.uid]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Require specific role(s)
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Optional auth - attaches user if token is valid, but doesn't require it
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await firebaseAuth.verifyIdToken(idToken);

    const [rows]: any = await pool.execute(
      'SELECT id, firebase_uid, email, display_name, role FROM users WHERE firebase_uid = ?',
      [decoded.uid]
    );

    if (rows && rows.length > 0) {
      req.user = rows[0];
    }

    next();
  } catch {
    // Token invalid, but that's ok for optional auth
    next();
  }
}
