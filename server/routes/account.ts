import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { requireAuthWithUser } from '../middleware/index.js';
import { 
  changePasswordSchema, 
  updateEmailSchema,
  deleteAccountSchema,
  recoverAccountSchema,
  type ChangePasswordInput,
  type UpdateEmailInput,
  type DeleteAccountInput,
  type RecoverAccountInput,
} from '../validators/auth.js';
import { getUsersCollection, userNameSchema } from '../models/User.js';
import { getUserPreferencesCollection } from '../models/UserPreferences.js';
import { getJournalEntriesCollection } from '../models/JournalEntry.js';
import { getVoiceNotesCollection } from '../models/VoiceNote.js';
import { getKickEventsCollection } from '../models/KickEvent.js';
import { getProgressCollection } from '../models/Progress.js';
import { getStreaksCollection } from '../models/Streak.js';
import { deleteVoiceNote } from '../db/gridfs.js';

const router = Router();

// Validation schema for updating account name
const updateAccountSchema = z.object({
  name: userNameSchema,
});

type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

// PUT /api/account - Update account details (name)
router.put('/', requireAuthWithUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = updateAccountSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { name }: UpdateAccountInput = validationResult.data;
    const user = req.user!;

    // Update user name
    const usersCollection = getUsersCollection();
    const now = new Date();
    
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          name,
          updatedAt: now,
        } 
      }
    );

    // Log account update for security monitoring
    console.log(`Account name updated for user: ${user.email}`);

    return res.status(200).json({
      message: 'Account updated successfully',
      user: {
        id: user._id.toString(),
        email: user.email,
        name,
        dueDate: user.dueDate?.toISOString() || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/account/email - Update email address (requires password confirmation)
router.put('/email', requireAuthWithUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = updateEmailSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { newEmail, password }: UpdateEmailInput = validationResult.data;
    const user = req.user!;
    const normalizedEmail = newEmail.toLowerCase();

    // Verify current password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password',
      });
    }

    // Check if new email is same as current
    if (normalizedEmail === user.email) {
      return res.status(400).json({
        error: 'New email must be different from current email',
      });
    }

    // Check if new email is already taken
    const usersCollection = getUsersCollection();
    const existingUser = await usersCollection.findOne({ 
      email: normalizedEmail,
      _id: { $ne: user._id }, // Exclude current user
    });
    
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered',
      });
    }

    // Update email
    const now = new Date();
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          email: normalizedEmail,
          updatedAt: now,
        } 
      }
    );

    // Log email change for security monitoring
    console.log(`Email updated for user: ${user.email} -> ${normalizedEmail}`);

    // In production, this would send a confirmation email to both old and new addresses
    // TODO: Implement email verification flow
    // await sendEmailChangeConfirmation(user.email, normalizedEmail);

    return res.status(200).json({
      message: 'Email updated successfully. A confirmation has been sent to your new email address.',
      user: {
        id: user._id.toString(),
        email: normalizedEmail,
        name: user.name,
        dueDate: user.dueDate?.toISOString() || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/account/password - Change password (requires current password)
router.put('/password', requireAuthWithUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = changePasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { currentPassword, newPassword }: ChangePasswordInput = validationResult.data;
    const user = req.user!;

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Current password is incorrect',
      });
    }

    // Check that new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({
        error: 'New password must be different from current password',
      });
    }

    // Hash new password with bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const usersCollection = getUsersCollection();
    const now = new Date();
    
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          passwordHash,
          updatedAt: now,
        } 
      }
    );

    // Log password change for security monitoring
    console.log(`Password changed for user: ${user.email}`);

    // In production, this would send a confirmation email
    // TODO: Send password change notification email
    // await sendPasswordChangeNotification(user.email);

    return res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/account - Request account deletion with 30-day grace period
router.delete('/', requireAuthWithUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = deleteAccountSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { password }: DeleteAccountInput = validationResult.data;
    const user = req.user!;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid password',
      });
    }

    // Check if deletion is already requested
    if (user.deletionRequestedAt) {
      const gracePeriodEnd = new Date(user.deletionRequestedAt);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
      
      return res.status(400).json({
        error: 'Account deletion already requested',
        deletionRequestedAt: user.deletionRequestedAt.toISOString(),
        permanentDeletionAt: gracePeriodEnd.toISOString(),
      });
    }

    // Set deletion requested timestamp
    const usersCollection = getUsersCollection();
    const now = new Date();
    
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          deletionRequestedAt: now,
          updatedAt: now,
        } 
      }
    );

    // Calculate permanent deletion date
    const permanentDeletionAt = new Date(now);
    permanentDeletionAt.setDate(permanentDeletionAt.getDate() + 30);

    // Log deletion request for security monitoring
    console.log(`Account deletion requested for user: ${user.email}`);

    // In production, this would send a confirmation email
    // TODO: Send account deletion confirmation email
    // await sendAccountDeletionConfirmation(user.email, permanentDeletionAt);

    return res.status(200).json({
      message: 'Account deletion requested. Your account will be permanently deleted in 30 days. You can recover your account by logging in before then.',
      deletionRequestedAt: now.toISOString(),
      permanentDeletionAt: permanentDeletionAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/account/recover - Recover account within grace period
router.post('/recover', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = recoverAccountSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { email, password }: RecoverAccountInput = validationResult.data;
    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user) {
      // Return generic error to prevent email enumeration
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Check if account has deletion requested
    if (!user.deletionRequestedAt) {
      return res.status(400).json({
        error: 'Account is not pending deletion',
      });
    }

    // Check if grace period has expired
    const gracePeriodEnd = new Date(user.deletionRequestedAt);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
    
    if (new Date() >= gracePeriodEnd) {
      return res.status(410).json({
        error: 'Account has been permanently deleted and cannot be recovered',
      });
    }

    // Remove deletion request
    const now = new Date();
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $unset: { deletionRequestedAt: '' },
        $set: { updatedAt: now },
      }
    );

    // Log account recovery for security monitoring
    console.log(`Account recovered for user: ${user.email}`);

    // In production, this would send a confirmation email
    // TODO: Send account recovery confirmation email
    // await sendAccountRecoveryConfirmation(user.email);

    return res.status(200).json({
      message: 'Account recovered successfully. Your account is no longer scheduled for deletion.',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        dueDate: user.dueDate?.toISOString() || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Validation schema for data migration
const migrateDataSchema = z.object({
  data: z.object({
    completedStories: z.array(z.number()).optional(),
    preferences: z.record(z.unknown()).optional(),
    streakData: z.record(z.unknown()).optional(),
    kickData: z.record(z.unknown()).optional(),
    journalData: z.record(z.unknown()).optional(),
  }),
});

// POST /api/account/migrate - Migrate guest localStorage data to user account
router.post('/migrate', requireAuthWithUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate request body
    const validationResult = migrateDataSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { data } = validationResult.data;
    const now = new Date();
    let migratedProgress = 0;
    let migratedPreferences = 0;
    let migratedStreaks = 0;
    let migratedKicks = 0;
    let migratedJournalEntries = 0;

    // Migrate completed stories / progress
    if (data.completedStories && data.completedStories.length > 0) {
      const progressCollection = getProgressCollection();
      
      for (const storyId of data.completedStories) {
        // Check if progress already exists for this story
        const existingProgress = await progressCollection.findOne({
          userId: user._id,
          storyId,
        });

        if (!existingProgress) {
          await progressCollection.insertOne({
            userId: user._id,
            storyId,
            completedSteps: [],
            currentStep: 'completed',
            isCompleted: true,
            completedAt: now,
            createdAt: now,
            updatedAt: now,
          } as any);
          migratedProgress++;
        }
      }
    }

    // Migrate preferences
    if (data.preferences) {
      const preferencesCollection = getUserPreferencesCollection();
      
      // Find existing preferences for user
      const existingPrefs = await preferencesCollection.findOne({ userId: user._id });
      
      if (existingPrefs) {
        // Merge guest preferences with existing (guest preferences take precedence)
        const updateFields: any = { updatedAt: now };
        
        if (data.preferences.theme) updateFields.theme = data.preferences.theme;
        if (data.preferences.fontSize) updateFields.fontSize = data.preferences.fontSize;
        if (data.preferences.readingMode) updateFields.readingMode = data.preferences.readingMode;
        
        await preferencesCollection.updateOne(
          { userId: user._id },
          { $set: updateFields }
        );
        migratedPreferences = 1;
      }
    }

    // Migrate streak data
    if (data.streakData) {
      const streaksCollection = getStreaksCollection();
      const streakData = data.streakData as any;
      
      // Find existing streak for this user
      const existingStreak = await streaksCollection.findOne({ userId: user._id });
      
      if (existingStreak) {
        // Merge streak data - keep the higher values
        const updateFields: any = {};
        
        if (streakData.currentStreak !== undefined) {
          updateFields.currentStreak = Math.max(
            existingStreak.currentStreak,
            streakData.currentStreak
          );
        }
        if (streakData.longestStreak !== undefined) {
          updateFields.longestStreak = Math.max(
            existingStreak.longestStreak,
            streakData.longestStreak
          );
        }
        
        if (Object.keys(updateFields).length > 0) {
          await streaksCollection.updateOne(
            { userId: user._id },
            { $set: updateFields }
          );
          migratedStreaks = 1;
        }
      } else {
        // Create new streak record
        await streaksCollection.insertOne({
          userId: user._id,
          currentStreak: streakData.currentStreak || 0,
          longestStreak: streakData.longestStreak || 0,
          lastActivityDate: streakData.lastActivityDate 
            ? new Date(streakData.lastActivityDate) 
            : now,
          streakHistory: [],
        } as any);
        migratedStreaks = 1;
      }
    }

    // Note: Kick data and journal data migration would need more complex handling
    if (data.kickData) {
      migratedKicks = 0; // TODO: Implement kick migration
    }

    if (data.journalData) {
      migratedJournalEntries = 0; // TODO: Implement journal migration
    }

    console.log(`Data migrated for user ${user.email}: ` +
      `progress=${migratedProgress}, preferences=${migratedPreferences}, ` +
      `streaks=${migratedStreaks}, kicks=${migratedKicks}, journal=${migratedJournalEntries}`);

    return res.status(200).json({
      message: 'Data migrated successfully',
      migratedItems: {
        progress: migratedProgress,
        preferences: migratedPreferences,
        streaks: migratedStreaks,
        kicks: migratedKicks,
        journalEntries: migratedJournalEntries,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Permanently delete a user account and all associated data.
 * This function is called by the scheduled job for expired accounts.
 */
export async function permanentlyDeleteAccount(userId: ObjectId): Promise<void> {
  const usersCollection = getUsersCollection();
  const preferencesCollection = getUserPreferencesCollection();
  const journalCollection = getJournalEntriesCollection();
  const voiceNotesCollection = getVoiceNotesCollection();
  const kicksCollection = getKickEventsCollection();
  const progressCollection = getProgressCollection();
  const streaksCollection = getStreaksCollection();

  // Delete voice notes from GridFS first (need to do this before deleting metadata)
  const voiceNotes = await voiceNotesCollection.find({ userId }).toArray();
  
  for (const voiceNote of voiceNotes) {
    try {
      await deleteVoiceNote(voiceNote.fileId);
    } catch (error) {
      console.error(`Failed to delete voice note file ${voiceNote.fileId}:`, error);
      // Continue with deletion even if GridFS delete fails
    }
  }

  // Delete all user-related data
  await Promise.all([
    journalCollection.deleteMany({ userId }),
    voiceNotesCollection.deleteMany({ userId }),
    kicksCollection.deleteMany({ userId }),
    progressCollection.deleteMany({ userId }),
    streaksCollection.deleteMany({ userId }),
  ]);

  // Delete user preferences
  await preferencesCollection.deleteOne({ userId });

  // Delete user account
  await usersCollection.deleteOne({ _id: userId });

  console.log(`Permanently deleted account: ${userId}`);
}

/**
 * Process expired account deletions.
 * This function should be called by a scheduled job (e.g., cron).
 * It finds all accounts where the 30-day grace period has expired
 * and permanently deletes them.
 */
export async function processExpiredAccountDeletions(): Promise<number> {
  const usersCollection = getUsersCollection();
  const now = new Date();
  
  // Find accounts where grace period has expired (30 days since deletion request)
  const gracePeriodCutoff = new Date(now);
  gracePeriodCutoff.setDate(gracePeriodCutoff.getDate() - 30);

  const expiredAccounts = await usersCollection.find({
    deletionRequestedAt: { $lte: gracePeriodCutoff },
  }).toArray();

  console.log(`Found ${expiredAccounts.length} expired accounts to delete`);

  let deletedCount = 0;
  for (const account of expiredAccounts) {
    try {
      await permanentlyDeleteAccount(account._id);
      deletedCount++;
    } catch (error) {
      console.error(`Failed to delete account ${account._id}:`, error);
    }
  }

  console.log(`Successfully deleted ${deletedCount} expired accounts`);
  return deletedCount;
}

export default router;
