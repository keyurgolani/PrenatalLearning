import { Router, type Request, type Response, type NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { requireAuthWithUser } from '../middleware/index.js';
import {
  logKickSchema,
  updateKickSchema,
  getKicksQuerySchema,
  getDailyStatsQuerySchema,
  type LogKickInput,
  type UpdateKickInput,
} from '../validators/kick.js';
import {
  getKickEventsCollection,
  type KickEventDocument,
} from '../models/KickEvent.js';

// Milestone definitions for kick counts
const MILESTONES = [
  { count: 10, label: 'First 10 kicks!' },
  { count: 50, label: '50 kicks milestone!' },
  { count: 100, label: '100 kicks achieved!' },
  { count: 250, label: '250 kicks - Amazing!' },
  { count: 500, label: '500 kicks - Incredible!' },
  { count: 1000, label: '1000 kicks - Superstar!' },
];

// Time period definitions for patterns
const TIME_PERIODS = {
  morning: { start: 6, end: 12, label: 'Morning (6am-12pm)' },
  afternoon: { start: 12, end: 18, label: 'Afternoon (12pm-6pm)' },
  evening: { start: 18, end: 22, label: 'Evening (6pm-10pm)' },
  night: { start: 22, end: 6, label: 'Night (10pm-6am)' },
};

const router = Router();

// All kick routes require authentication
router.use(requireAuthWithUser);

// GET /api/kicks - List kick events with date range filter
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate query parameters
    const validationResult = getKicksQuerySchema.safeParse(req.query);
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

    const kicksCollection = getKickEventsCollection();

    // Build query
    const query: { userId: typeof user._id; timestamp?: { $gte?: Date; $lte?: Date } } = { userId: user._id };

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    // Get total count for pagination
    const total = await kicksCollection.countDocuments(query);

    // Get kicks with pagination, sorted by timestamp descending (most recent first)
    const kicks = await kicksCollection
      .find(query)
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return res.status(200).json({
      kicks: kicks.map(kick => ({
        id: kick._id.toString(),
        timestamp: kick.timestamp.toISOString(),
        note: kick.note || null,
        createdAt: kick.createdAt.toISOString(),
        updatedAt: kick.updatedAt.toISOString(),
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + kicks.length < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/kicks - Log a kick event with timestamp
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate request body
    const validationResult = logKickSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { timestamp, note }: LogKickInput = validationResult.data;

    const kicksCollection = getKickEventsCollection();

    const now = new Date();
    // Use provided timestamp or current time (Requirements: 13.5 - timestamp each kick event with exact time)
    const kickTimestamp = timestamp ? new Date(timestamp) : now;

    // Create kick event document
    const kickDoc: KickEventDocument = {
      userId: user._id,
      timestamp: kickTimestamp,
      note: note || undefined,
      createdAt: now,
      updatedAt: now,
    };

    // Insert kick event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await kicksCollection.insertOne(kickDoc as any);
    const kickId = result.insertedId;

    console.log(`Kick event logged: ${kickId} for user: ${user._id}`);

    return res.status(201).json({
      message: 'Kick logged successfully',
      kick: {
        id: kickId.toString(),
        timestamp: kickTimestamp.toISOString(),
        note: note || null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/kicks/:id - Add/update note on a kick event
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid kick event ID format',
      });
    }

    // Validate request body
    const validationResult = updateKickSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { note }: UpdateKickInput = validationResult.data;

    const kicksCollection = getKickEventsCollection();

    // Check if kick exists and belongs to user
    const existingKick = await kicksCollection.findOne({
      _id: new ObjectId(id),
      userId: user._id,
    });

    if (!existingKick) {
      return res.status(404).json({
        error: 'Kick event not found',
      });
    }

    const now = new Date();

    // Update kick event (Requirements: 13.6 - allow users to add notes to individual kick events)
    await kicksCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          note: note || undefined,
          updatedAt: now,
        },
      }
    );

    // Fetch updated kick
    const updatedKick = await kicksCollection.findOne({ _id: new ObjectId(id) });

    console.log(`Kick event updated: ${id} for user: ${user._id}`);

    return res.status(200).json({
      message: 'Kick updated successfully',
      kick: {
        id: updatedKick!._id.toString(),
        timestamp: updatedKick!.timestamp.toISOString(),
        note: updatedKick!.note || null,
        createdAt: updatedKick!.createdAt.toISOString(),
        updatedAt: updatedKick!.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/kicks/:id - Delete a kick event
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid kick event ID format',
      });
    }

    const kicksCollection = getKickEventsCollection();

    // Check if kick exists and belongs to user
    const existingKick = await kicksCollection.findOne({
      _id: new ObjectId(id),
      userId: user._id,
    });

    if (!existingKick) {
      return res.status(404).json({
        error: 'Kick event not found',
      });
    }

    // Delete the kick event
    await kicksCollection.deleteOne({ _id: new ObjectId(id) });

    console.log(`Kick event deleted: ${id} for user: ${user._id}`);

    return res.status(200).json({
      message: 'Kick deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/kicks/stats - Get overall kick statistics
// Requirements: 14.1, 14.2, 14.7 - Display kick count graphs, weekly summary, milestone markers
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    const kicksCollection = getKickEventsCollection();

    // Get total kick count
    const totalKicks = await kicksCollection.countDocuments({
      userId: user._id,
    });

    // Get first and last kick dates
    const firstKick = await kicksCollection
      .find({ userId: user._id })
      .sort({ timestamp: 1 })
      .limit(1)
      .toArray();

    const lastKick = await kicksCollection
      .find({ userId: user._id })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    // Calculate days tracking
    let daysTracking = 0;
    if (firstKick.length > 0) {
      const firstDate = firstKick[0].timestamp;
      const now = new Date();
      daysTracking = Math.ceil((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Calculate average kicks per day
    const averagePerDay = daysTracking > 0 ? Math.round((totalKicks / daysTracking) * 10) / 10 : 0;

    // Get kicks from last 7 days for weekly average
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyKicks = await kicksCollection.countDocuments({
      userId: user._id,
      timestamp: { $gte: sevenDaysAgo },
    });

    const weeklyAverage = Math.round((weeklyKicks / 7) * 10) / 10;

    // Determine achieved milestones and next milestone
    const achievedMilestones = MILESTONES.filter(m => totalKicks >= m.count);
    const nextMilestone = MILESTONES.find(m => totalKicks < m.count) || null;

    // Calculate progress to next milestone
    let progressToNextMilestone = 100;
    if (nextMilestone) {
      const previousMilestone = achievedMilestones.length > 0 
        ? achievedMilestones[achievedMilestones.length - 1].count 
        : 0;
      const range = nextMilestone.count - previousMilestone;
      const progress = totalKicks - previousMilestone;
      progressToNextMilestone = Math.round((progress / range) * 100);
    }

    return res.status(200).json({
      totalKicks,
      daysTracking,
      averagePerDay,
      weeklyKicks,
      weeklyAverage,
      firstKickDate: firstKick.length > 0 ? firstKick[0].timestamp.toISOString() : null,
      lastKickDate: lastKick.length > 0 ? lastKick[0].timestamp.toISOString() : null,
      milestones: {
        achieved: achievedMilestones,
        next: nextMilestone,
        progressToNext: progressToNextMilestone,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/kicks/daily - Get daily kick counts for graph
// Requirements: 14.1, 14.5 - Display daily kick count graph, view kick history for any date range
router.get('/daily', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    // Validate query parameters
    const validationResult = getDailyStatsQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { days } = validationResult.data;

    const kicksCollection = getKickEventsCollection();

    // Calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    // Aggregate kicks by day
    const dailyKicks = await kicksCollection.aggregate([
      {
        $match: {
          userId: user._id,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
          },
          count: { $sum: 1 },
          firstKick: { $min: '$timestamp' },
          lastKick: { $max: '$timestamp' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]).toArray();

    // Create a map of dates with kicks
    const kicksByDate = new Map<string, { count: number; firstKick: Date; lastKick: Date }>();
    for (const day of dailyKicks) {
      const dateStr = `${day._id.year}-${String(day._id.month).padStart(2, '0')}-${String(day._id.day).padStart(2, '0')}`;
      kicksByDate.set(dateStr, {
        count: day.count,
        firstKick: day.firstKick,
        lastKick: day.lastKick,
      });
    }

    // Generate array for all days in range (including days with 0 kicks)
    const result: {
      date: string;
      count: number;
      firstKick: string | null;
      lastKick: string | null;
    }[] = [];

    const currentDate = new Date(startDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = kicksByDate.get(dateStr);

      result.push({
        date: dateStr,
        count: dayData?.count || 0,
        firstKick: dayData?.firstKick?.toISOString() || null,
        lastKick: dayData?.lastKick?.toISOString() || null,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate peak day
    let peakDay = result.length > 0 ? result[0] : null;
    for (const day of result) {
      if (peakDay && day.count > peakDay.count) {
        peakDay = day;
      }
    }

    // Calculate total and average for the period
    const totalInPeriod = result.reduce((sum, day) => sum + day.count, 0);
    const averageInPeriod = result.length > 0 ? Math.round((totalInPeriod / result.length) * 10) / 10 : 0;

    return res.status(200).json({
      days: result,
      summary: {
        totalKicks: totalInPeriod,
        averagePerDay: averageInPeriod,
        peakDay: peakDay ? { date: peakDay.date, count: peakDay.count } : null,
        daysWithKicks: result.filter(d => d.count > 0).length,
        daysWithoutKicks: result.filter(d => d.count === 0).length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/kicks/patterns - Get time-of-day distribution
// Requirements: 14.3, 14.6 - Highlight peak activity times, display kick patterns by time of day
router.get('/patterns', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    const kicksCollection = getKickEventsCollection();

    // Aggregate kicks by hour of day
    const hourlyKicks = await kicksCollection.aggregate([
      {
        $match: {
          userId: user._id,
        },
      },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]).toArray();

    // Create hourly distribution (0-23)
    const hourlyDistribution: { hour: number; count: number; label: string }[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourData = hourlyKicks.find(h => h._id === hour);
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      hourlyDistribution.push({
        hour,
        count: hourData?.count || 0,
        label: `${displayHour}${period}`,
      });
    }

    // Calculate time period totals
    const periodTotals = {
      morning: 0,   // 6am-12pm
      afternoon: 0, // 12pm-6pm
      evening: 0,   // 6pm-10pm
      night: 0,     // 10pm-6am
    };

    for (const hourData of hourlyDistribution) {
      const hour = hourData.hour;
      if (hour >= 6 && hour < 12) {
        periodTotals.morning += hourData.count;
      } else if (hour >= 12 && hour < 18) {
        periodTotals.afternoon += hourData.count;
      } else if (hour >= 18 && hour < 22) {
        periodTotals.evening += hourData.count;
      } else {
        periodTotals.night += hourData.count;
      }
    }

    // Determine peak period
    const totalKicks = Object.values(periodTotals).reduce((sum, count) => sum + count, 0);
    let peakPeriod: { period: string; count: number; percentage: number } | null = null;
    let maxCount = 0;

    for (const [period, count] of Object.entries(periodTotals)) {
      if (count > maxCount) {
        maxCount = count;
        peakPeriod = {
          period,
          count,
          percentage: totalKicks > 0 ? Math.round((count / totalKicks) * 100) : 0,
        };
      }
    }

    // Determine peak hour
    let peakHour: { hour: number; count: number; label: string } | null = null;
    for (const hourData of hourlyDistribution) {
      if (!peakHour || hourData.count > peakHour.count) {
        peakHour = hourData;
      }
    }

    // Calculate percentages for each period
    const periodStats = Object.entries(periodTotals).map(([period, count]) => ({
      period,
      label: TIME_PERIODS[period as keyof typeof TIME_PERIODS].label,
      count,
      percentage: totalKicks > 0 ? Math.round((count / totalKicks) * 100) : 0,
    }));

    return res.status(200).json({
      hourlyDistribution,
      periodStats,
      peakPeriod,
      peakHour,
      totalKicks,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
