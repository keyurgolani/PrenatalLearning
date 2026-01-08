import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

interface AdminJwtPayload {
  role: 'admin';
  iat: number;
  exp: number;
}

export async function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token = req.cookies?.adminToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({ error: 'Admin authentication required' });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as AdminJwtPayload;
      if (decoded.role !== 'admin') {
        throw new Error('Invalid role');
      }
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired admin token' });
      return;
    }
  } catch (error) {
    next(error);
  }
}
