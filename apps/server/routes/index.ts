import { Router } from 'express';
import authRoutes from './auth.js';
import accountRoutes from './account.js';
import preferencesRoutes from './preferences.js';
import journalRoutes from './journal.js';
import voiceNotesRoutes from './voice-notes.js';
import kicksRoutes from './kicks.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
router.use('/auth', authRoutes);

// Account routes (protected)
router.use('/account', accountRoutes);

// Preferences routes (protected)
router.use('/preferences', preferencesRoutes);

// Journal routes (protected)
router.use('/journal', journalRoutes);

// Voice notes routes (protected)
router.use('/voice-notes', voiceNotesRoutes);

// Kicks routes (protected)
router.use('/kicks', kicksRoutes);

export default router;
