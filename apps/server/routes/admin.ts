import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { requireAdminAuth } from '../middleware/adminAuth.js';
import { getUsersCollection } from '../models/User.js';
import { getKickEventsCollection } from '../models/KickEvent.js';
import { getJournalEntriesCollection } from '../models/JournalEntry.js';

const router = Router();

// Admin Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (username !== config.admin.username || password !== config.admin.password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate Admin Token
    const token = jwt.sign({ role: 'admin' }, config.jwt.secret, {
      expiresIn: '1d', // Admin session lasts 1 day
    });

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: config.server.nodeEnv === 'production',
      sameSite: 'lax', // Allow for dashboard usage
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Stats
router.get('/stats', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const usersCollection = getUsersCollection();
    const kicksCollection = getKickEventsCollection();
    const journalsCollection = getJournalEntriesCollection();

    // Fetch all users
    const users = await usersCollection.find({}, {
      projection: { _id: 1, email: 1, dueDate: 1, createdAt: 1, lastLoginAt: 1 }
    }).toArray();

    // Aggregate stats for each user
    const userStats = await Promise.all(users.map(async (user) => {
      const kickCount = await kicksCollection.countDocuments({ userId: user._id });
      const journalCount = await journalsCollection.countDocuments({ userId: user._id });

      return {
        userId: user._id,
        email: user.email,
        dueDate: user.dueDate,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        kickCount,
        journalCount,
      };
    }));

    res.json({
      totalUsers: users.length,
      userStats,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Check Auth Status
router.get('/me', requireAdminAuth, (_req: Request, res: Response) => {
  res.status(200).json({ authenticated: true, role: 'admin' });
});

// Logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logged out' });
});

export default router;
