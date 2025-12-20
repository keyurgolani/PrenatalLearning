import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { config } from '../config/index.js';
import { getUsersCollection, type User } from '../models/User.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: User;
    }
  }
}

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Authentication middleware that validates JWT tokens on protected routes.
 * Extracts user ID from token and attaches it to the request.
 * Returns 401 if token is missing, expired, or invalid.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Verify and decode token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: 'Token expired' });
        return;
      }
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Validate userId format
    if (!decoded.userId || !ObjectId.isValid(decoded.userId)) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Attach userId to request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Authentication middleware that also loads the full user object.
 * Use this when you need access to user data in the route handler.
 */
export async function requireAuthWithUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // First run the basic auth check
    await new Promise<void>((resolve, reject) => {
      requireAuth(req, res, (err?: unknown) => {
        if (err) reject(err);
        else if (!req.userId) reject(new Error('Auth failed'));
        else resolve();
      });
    });

    // If we got here without userId, the response was already sent
    if (!req.userId) {
      return;
    }

    // Load user from database
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(req.userId) 
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Check if account is pending deletion and past grace period
    if (user.deletionRequestedAt) {
      const gracePeriodEnd = new Date(user.deletionRequestedAt);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
      
      if (new Date() >= gracePeriodEnd) {
        res.status(401).json({ error: 'Account no longer exists' });
        return;
      }
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    // If the error is because auth already sent a response, don't call next
    if (res.headersSent) {
      return;
    }
    next(error);
  }
}
