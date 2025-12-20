import { Router, type Request, type Response, type NextFunction } from 'express';
import { requireAuthWithUser } from '../middleware/index.js';
import {
  createJournalEntrySchema,
  updateJournalEntrySchema,
  getJournalEntriesQuerySchema,
  getCalendarDataQuerySchema,
  type CreateJournalEntryInput,
  type UpdateJournalEntryInput,
} from '../validators/journal.js';
import {
  getJournalEntriesCollection,
  normalizeDateToMidnight,
  type JournalEntryDocument,
  type TopicReference,
  type JourneyReference,
} from '../models/JournalEntry.js';
import { parseReferences, validateTopicReferences, validateJourneyReferences } from '../utils/referenceParser.js';
import { availableTopics, availableJourneys } from '../data/topicsAndJourneys.js';
import { validateObjectId } from '../utils/objectIdValidator.js';

const router = Router();

/**
 * Merge topic references, deduplicating by topicId
 * Parsed references take precedence (they come from content)
 */
function mergeTopicReferences(
  parsed: TopicReference[],
  explicit: TopicReference[]
): TopicReference[] {
  const seenIds = new Set<number>();
  const merged: TopicReference[] = [];
  
  // Add parsed references first
  for (const ref of parsed) {
    if (!seenIds.has(ref.topicId)) {
      seenIds.add(ref.topicId);
      merged.push(ref);
    }
  }
  
  // Add explicit references that weren't already added
  for (const ref of explicit) {
    if (!seenIds.has(ref.topicId)) {
      seenIds.add(ref.topicId);
      merged.push(ref);
    }
  }
  
  return merged;
}

/**
 * Merge journey references, deduplicating by journeyId
 * Parsed references take precedence (they come from content)
 */
function mergeJourneyReferences(
  parsed: JourneyReference[],
  explicit: JourneyReference[]
): JourneyReference[] {
  const seenIds = new Set<string>();
  const merged: JourneyReference[] = [];
  
  // Add parsed references first
  for (const ref of parsed) {
    if (!seenIds.has(ref.journeyId)) {
      seenIds.add(ref.journeyId);
      merged.push(ref);
    }
  }
  
  // Add explicit references that weren't already added
  for (const ref of explicit) {
    if (!seenIds.has(ref.journeyId)) {
      seenIds.add(ref.journeyId);
      merged.push(ref);
    }
  }
  
  return merged;
}

// All journal routes require authentication
router.use(requireAuthWithUser);

// GET /api/journal - List journal entries with date range filter
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate query parameters
    const validationResult = getJournalEntriesQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { startDate, endDate, limit, offset } = validationResult.data;

    const journalCollection = getJournalEntriesCollection();

    // Build query
    const query: any = { userId: user._id };

    if (startDate || endDate) {
      query.journalDate = {};
      if (startDate) {
        query.journalDate.$gte = normalizeDateToMidnight(new Date(startDate));
      }
      if (endDate) {
        query.journalDate.$lte = normalizeDateToMidnight(new Date(endDate));
      }
    }

    // Get total count for pagination
    const total = await journalCollection.countDocuments(query);

    // Get entries with pagination, sorted by journalDate desc, then createdAt desc
    const entries = await journalCollection
      .find(query)
      .sort({ journalDate: -1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return res.status(200).json({
      entries: entries.map(entry => ({
        id: entry._id.toString(),
        journalDate: entry.journalDate.toISOString(),
        content: entry.content,
        mood: entry.mood || null,
        kickCount: entry.kickCount || 0,
        entryType: entry.entryType || 'text',
        topicReferences: entry.topicReferences || [],
        journeyReferences: entry.journeyReferences || [],
        voiceNoteIds: entry.voiceNoteIds?.map(id => id.toString()) || [],
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + entries.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/journal/moods - Get mood statistics
router.get('/moods', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate query parameters
    const daysParam = req.query.days;
    const days = daysParam ? parseInt(daysParam as string, 10) : 30;

    if (isNaN(days) || days < 1 || days > 365) {
      return res.status(400).json({
        error: 'Invalid days parameter. Must be between 1 and 365.',
      });
    }

    const journalCollection = getJournalEntriesCollection();

    // Calculate date range
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);

    // Get entries with moods in the date range
    const entries = await journalCollection
      .find({
        userId: user._id,
        journalDate: {
          $gte: startDate,
          $lte: endDate,
        },
        mood: { $exists: true },
      } as any)
      .project({ journalDate: 1, mood: 1 })
      .sort({ journalDate: 1, createdAt: 1 })
      .toArray();

    // Calculate mood distribution
    const moodCounts: { [mood: string]: number } = {};
    const moodTrend: { date: string; mood: string }[] = [];

    for (const entry of entries) {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        moodTrend.push({
          date: entry.journalDate.toISOString().split('T')[0],
          mood: entry.mood,
        });
      }
    }

    // Calculate total entries with mood
    const totalWithMood = entries.length;

    // Calculate percentages
    const moodDistribution: { mood: string; count: number; percentage: number }[] = [];
    for (const [mood, count] of Object.entries(moodCounts)) {
      moodDistribution.push({
        mood,
        count,
        percentage: totalWithMood > 0 ? Math.round((count / totalWithMood) * 100) : 0,
      });
    }

    // Sort by count descending
    moodDistribution.sort((a, b) => b.count - a.count);

    // Find most common mood
    const mostCommonMood = moodDistribution.length > 0 ? moodDistribution[0].mood : null;

    return res.status(200).json({
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      totalEntriesWithMood: totalWithMood,
      mostCommonMood,
      moodDistribution,
      moodTrend,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/journal/date/:date - Get all entries for a specific date
router.get('/date/:date', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { date } = req.params;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD format.',
      });
    }

    // Parse and validate the date
    const parsedDate = new Date(date + 'T00:00:00.000Z');
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid date value.',
      });
    }

    const journalCollection = getJournalEntriesCollection();

    // Normalize the date to midnight UTC
    const normalizedDate = normalizeDateToMidnight(parsedDate);

    // Get all entries for the specific date, sorted by createdAt timestamp
    const entries = await journalCollection
      .find({
        userId: user._id,
        journalDate: normalizedDate,
      })
      .sort({ createdAt: 1 }) // Sort by createdAt ascending (oldest first)
      .toArray();

    return res.status(200).json({
      date: date,
      entries: entries.map(entry => ({
        id: entry._id.toString(),
        journalDate: entry.journalDate.toISOString(),
        content: entry.content,
        mood: entry.mood || null,
        kickCount: entry.kickCount || 0,
        entryType: entry.entryType || 'text',
        topicReferences: entry.topicReferences || [],
        journeyReferences: entry.journeyReferences || [],
        voiceNoteIds: entry.voiceNoteIds?.map(id => id.toString()) || [],
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      })),
      count: entries.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/journal/calendar - Get calendar data with entry indicators
router.get('/calendar', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate query parameters
    const validationResult = getCalendarDataQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { month, year } = validationResult.data;

    const journalCollection = getJournalEntriesCollection();

    // Calculate start and end of month
    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Get entries for the month with only journalDate and mood fields
    const entries = await journalCollection
      .find({
        userId: user._id,
        journalDate: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      })
      .project({ journalDate: 1, mood: 1, _id: 1 })
      .toArray();

    // Build calendar data - map of day number to entry info (supports multiple entries per day)
    const daysWithEntries: { [day: number]: { hasEntry: boolean; entryCount: number; moods: string[]; entryIds: string[] } } = {};

    for (const entry of entries) {
      const day = entry.journalDate.getUTCDate();
      if (!daysWithEntries[day]) {
        daysWithEntries[day] = {
          hasEntry: true,
          entryCount: 0,
          moods: [],
          entryIds: [],
        };
      }
      daysWithEntries[day].entryCount++;
      daysWithEntries[day].entryIds.push(entry._id.toString());
      if (entry.mood) {
        daysWithEntries[day].moods.push(entry.mood);
      }
    }

    return res.status(200).json({
      month,
      year,
      daysWithEntries,
      totalEntries: entries.length,
    });
  } catch (error) {
    next(error);
  }
});


// POST /api/journal - Create journal entry (multiple entries per date allowed)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate request body
    const validationResult = createJournalEntrySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { journalDate, content, mood, kickCount, entryType, topicReferences, journeyReferences }: CreateJournalEntryInput =
      validationResult.data;

    const journalCollection = getJournalEntriesCollection();

    // Normalize journalDate to midnight UTC (logical date for organization)
    const normalizedJournalDate = normalizeDateToMidnight(new Date(journalDate));

    // NOTE: Multiple entries per date are now allowed (Requirements: 10.9, 18.3)
    // The "entry already exists" check has been removed

    // Parse @ and # mentions from content (Requirements: 11.4, 11.5, 11.6)
    const parsedRefs = parseReferences(content || '', availableTopics, availableJourneys);
    
    // Validate any explicitly provided references
    const validatedExplicitTopics = validateTopicReferences(topicReferences || [], availableTopics);
    const validatedExplicitJourneys = validateJourneyReferences(journeyReferences || [], availableJourneys);
    
    // Merge parsed references with explicitly provided ones (deduplicate by ID)
    const mergedTopicRefs = mergeTopicReferences(parsedRefs.topicReferences, validatedExplicitTopics);
    const mergedJourneyRefs = mergeJourneyReferences(parsedRefs.journeyReferences, validatedExplicitJourneys);

    const now = new Date();

    // Create journal entry document
    const entryDoc: JournalEntryDocument = {
      userId: user._id,
      journalDate: normalizedJournalDate, // Logical date for organization
      content: content || '',
      mood: mood || undefined,
      kickCount: kickCount || undefined,
      entryType: entryType || 'text',
      topicReferences: mergedTopicRefs,
      journeyReferences: mergedJourneyRefs,
      voiceNoteIds: [],
      createdAt: now, // Actual creation timestamp
      updatedAt: now, // Actual update timestamp
    };

    // Insert entry
    const result = await journalCollection.insertOne(entryDoc as any);
    const entryId = result.insertedId;

    console.log(`Journal entry created: ${entryId} for user: ${user._id}`);

    return res.status(201).json({
      message: 'Journal entry created successfully',
      entry: {
        id: entryId.toString(),
        journalDate: normalizedJournalDate.toISOString(),
        content: content || '',
        mood: mood || null,
        kickCount: kickCount || 0,
        entryType: entryType || 'text',
        topicReferences: mergedTopicRefs,
        journeyReferences: mergedJourneyRefs,
        voiceNoteIds: [],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/journal/:id - Get single journal entry
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Validate ObjectId format with detailed error message
    // Requirements: 18.4 - Handle string IDs correctly
    const validation = validateObjectId(id, 'journal entry ID');
    if (!validation.isValid || !validation.objectId) {
      return res.status(400).json({
        error: validation.error || 'Invalid journal entry ID format',
      });
    }

    const journalCollection = getJournalEntriesCollection();

    // Find entry that belongs to user
    const entry = await journalCollection.findOne({
      _id: validation.objectId,
      userId: user._id,
    });

    if (!entry) {
      return res.status(404).json({
        error: 'Journal entry not found',
      });
    }

    return res.status(200).json({
      entry: {
        id: entry._id.toString(),
        journalDate: entry.journalDate.toISOString(),
        content: entry.content,
        mood: entry.mood || null,
        kickCount: entry.kickCount || 0,
        entryType: entry.entryType || 'text',
        topicReferences: entry.topicReferences || [],
        journeyReferences: entry.journeyReferences || [],
        voiceNoteIds: entry.voiceNoteIds?.map(id => id.toString()) || [],
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/journal/:id - Update journal entry with auto-save support
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Validate ObjectId format with detailed error message
    // Requirements: 18.4 - Handle string IDs correctly
    const validation = validateObjectId(id, 'journal entry ID');
    if (!validation.isValid || !validation.objectId) {
      return res.status(400).json({
        error: validation.error || 'Invalid journal entry ID format',
      });
    }

    // Validate request body
    const validationResult = updateJournalEntrySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const updateData: UpdateJournalEntryInput = validationResult.data;

    const journalCollection = getJournalEntriesCollection();

    // Check if entry exists and belongs to user
    const existingEntry = await journalCollection.findOne({
      _id: validation.objectId,
      userId: user._id,
    });

    if (!existingEntry) {
      return res.status(404).json({
        error: 'Journal entry not found',
      });
    }

    // Build update object
    const now = new Date();
    const updateFields: any = { updatedAt: now };

    if (updateData.content !== undefined) {
      updateFields.content = updateData.content;
      
      // Parse @ and # mentions from updated content (Requirements: 11.4, 11.5, 11.6)
      const parsedRefs = parseReferences(updateData.content, availableTopics, availableJourneys);
      
      // Validate any explicitly provided references
      const validatedExplicitTopics = validateTopicReferences(updateData.topicReferences || [], availableTopics);
      const validatedExplicitJourneys = validateJourneyReferences(updateData.journeyReferences || [], availableJourneys);
      
      // Merge parsed references with explicitly provided ones (deduplicate by ID)
      updateFields.topicReferences = mergeTopicReferences(parsedRefs.topicReferences, validatedExplicitTopics);
      updateFields.journeyReferences = mergeJourneyReferences(parsedRefs.journeyReferences, validatedExplicitJourneys);
    } else {
      // If content is not being updated, only update references if explicitly provided
      if (updateData.topicReferences !== undefined) {
        updateFields.topicReferences = validateTopicReferences(updateData.topicReferences, availableTopics);
      }

      if (updateData.journeyReferences !== undefined) {
        updateFields.journeyReferences = validateJourneyReferences(updateData.journeyReferences, availableJourneys);
      }
    }

    if (updateData.mood !== undefined) {
      // Allow null to clear mood
      updateFields.mood = updateData.mood === null ? undefined : updateData.mood;
    }

    if (updateData.kickCount !== undefined) {
      updateFields.kickCount = updateData.kickCount > 0 ? updateData.kickCount : undefined;
    }

    // Update entry
    await journalCollection.updateOne(
      { _id: validation.objectId },
      { $set: updateFields }
    );

    // Fetch updated entry
    const updatedEntry = await journalCollection.findOne({ _id: validation.objectId });

    console.log(`Journal entry updated: ${id} for user: ${user._id}`);

    return res.status(200).json({
      message: 'Journal entry updated successfully',
      entry: {
        id: updatedEntry!._id.toString(),
        journalDate: updatedEntry!.journalDate.toISOString(),
        content: updatedEntry!.content,
        mood: updatedEntry!.mood || null,
        entryType: updatedEntry!.entryType || 'text',
        kickCount: updatedEntry!.kickCount || 0,
        topicReferences: updatedEntry!.topicReferences || [],
        journeyReferences: updatedEntry!.journeyReferences || [],
        voiceNoteIds: updatedEntry!.voiceNoteIds?.map(id => id.toString()) || [],
        createdAt: updatedEntry!.createdAt.toISOString(),
        updatedAt: updatedEntry!.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/journal/:id - Delete journal entry
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Validate ObjectId format with detailed error message
    // Requirements: 18.4 - Handle string IDs correctly
    const validation = validateObjectId(id, 'journal entry ID');
    if (!validation.isValid || !validation.objectId) {
      return res.status(400).json({
        error: validation.error || 'Invalid journal entry ID format',
      });
    }

    const journalCollection = getJournalEntriesCollection();

    // Check if entry exists and belongs to user
    const existingEntry = await journalCollection.findOne({
      _id: validation.objectId,
      userId: user._id,
    });

    if (!existingEntry) {
      return res.status(404).json({
        error: 'Journal entry not found',
      });
    }

    // Delete the entry
    await journalCollection.deleteOne({ _id: validation.objectId });

    console.log(`Journal entry deleted: ${id} for user: ${user._id}`);

    // Note: Voice notes associated with this entry should also be deleted
    // This will be handled by the voice notes endpoint or a cleanup job

    return res.status(200).json({
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
