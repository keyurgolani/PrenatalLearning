import { Router, type Request, type Response, type NextFunction } from 'express';
import { requireAuthWithUser } from '../middleware/index.js';
import { updatePreferencesSchema, type UpdatePreferencesInput } from '../validators/preferences.js';
import { 
  getUserPreferencesCollection, 
  DEFAULT_PREFERENCES,
  type UserPreferencesDocument 
} from '../models/UserPreferences.js';

const router = Router();

// All preferences routes require authentication
router.use(requireAuthWithUser);

// GET /api/preferences - Get user preferences
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const preferencesCollection = getUserPreferencesCollection();

    // Find user preferences
    let preferences = await preferencesCollection.findOne({ userId: user._id });

    // If no preferences exist, create default preferences
    if (!preferences) {
      const now = new Date();
      const defaultPrefs: UserPreferencesDocument = {
        userId: user._id,
        ...DEFAULT_PREFERENCES,
        updatedAt: now,
      };

      const result = await preferencesCollection.insertOne(defaultPrefs as any);
      preferences = {
        _id: result.insertedId,
        ...defaultPrefs,
      };

      console.log(`Default preferences created for user: ${user.email}`);
    }

    return res.status(200).json({
      preferences: {
        theme: preferences.theme,
        fontSize: preferences.fontSize,
        readingMode: preferences.readingMode,
        notifications: preferences.notifications,
        accessibility: preferences.accessibility,
        dueDate: preferences.dueDate ? preferences.dueDate.toISOString() : null,
        topicProgress: preferences.topicProgress || null,
        completedStories: preferences.completedStories || null,
        updatedAt: preferences.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/preferences - Update preferences
router.put('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate request body
    const validationResult = updatePreferencesSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const updateData: UpdatePreferencesInput = validationResult.data;
    const preferencesCollection = getUserPreferencesCollection();
    const now = new Date();

    // Find existing preferences
    let preferences = await preferencesCollection.findOne({ userId: user._id });

    // If no preferences exist, create with defaults and apply updates
    if (!preferences) {
      const newPrefs: UserPreferencesDocument = {
        userId: user._id,
        ...DEFAULT_PREFERENCES,
        updatedAt: now,
      };

      // Apply updates to new preferences
      if (updateData.theme !== undefined) {
        newPrefs.theme = updateData.theme;
      }
      if (updateData.fontSize !== undefined) {
        newPrefs.fontSize = updateData.fontSize;
      }
      if (updateData.readingMode !== undefined) {
        newPrefs.readingMode = updateData.readingMode;
      }
      if (updateData.notifications !== undefined) {
        newPrefs.notifications = {
          ...newPrefs.notifications,
          ...updateData.notifications,
        };
      }
      if (updateData.accessibility !== undefined) {
        newPrefs.accessibility = {
          ...newPrefs.accessibility,
          ...updateData.accessibility,
        };
      }
      if (updateData.dueDate !== undefined) {
        newPrefs.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
      }
      if (updateData.topicProgress !== undefined) {
        newPrefs.topicProgress = updateData.topicProgress;
      }
      if (updateData.completedStories !== undefined) {
        newPrefs.completedStories = updateData.completedStories;
      }

      const result = await preferencesCollection.insertOne(newPrefs as any);
      preferences = {
        _id: result.insertedId,
        ...newPrefs,
      };

      console.log(`Preferences created and updated for user: ${user.email}`);
    } else {
      // Build update object for existing preferences
      const updateFields: any = { updatedAt: now };

      if (updateData.theme !== undefined) {
        updateFields.theme = updateData.theme;
      }
      if (updateData.fontSize !== undefined) {
        updateFields.fontSize = updateData.fontSize;
      }
      if (updateData.readingMode !== undefined) {
        updateFields.readingMode = updateData.readingMode;
      }
      if (updateData.notifications !== undefined) {
        // Merge notification preferences
        updateFields.notifications = {
          ...preferences.notifications,
          ...updateData.notifications,
        };
      }
      if (updateData.accessibility !== undefined) {
        // Merge accessibility preferences
        updateFields.accessibility = {
          ...preferences.accessibility,
          ...updateData.accessibility,
        };
      }
      if (updateData.dueDate !== undefined) {
        // Handle dueDate - can be set to a date string or cleared with null
        updateFields.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
      }
      if (updateData.topicProgress !== undefined) {
        // Handle topicProgress - can be set to progress map or cleared with null
        updateFields.topicProgress = updateData.topicProgress;
      }
      if (updateData.completedStories !== undefined) {
        // Handle completedStories - can be set to array or cleared with null
        updateFields.completedStories = updateData.completedStories;
      }

      // Update preferences
      await preferencesCollection.updateOne(
        { userId: user._id },
        { $set: updateFields }
      );

      // Fetch updated preferences
      preferences = await preferencesCollection.findOne({ userId: user._id });

      console.log(`Preferences updated for user: ${user.email}`);
    }

    return res.status(200).json({
      message: 'Preferences updated successfully',
      preferences: {
        theme: preferences!.theme,
        fontSize: preferences!.fontSize,
        readingMode: preferences!.readingMode,
        notifications: preferences!.notifications,
        accessibility: preferences!.accessibility,
        dueDate: preferences!.dueDate ? preferences!.dueDate.toISOString() : null,
        topicProgress: preferences!.topicProgress || null,
        completedStories: preferences!.completedStories || null,
        updatedAt: preferences!.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
