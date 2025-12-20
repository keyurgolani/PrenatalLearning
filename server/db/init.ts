import { connectToDatabase, getDatabase } from './connection.js';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  USER_PREFERENCES: 'userPreferences',
  JOURNAL_ENTRIES: 'journalEntries',
  VOICE_NOTES: 'voiceNotes',
  KICK_EVENTS: 'kickEvents',
  PROGRESS: 'progress',
  STREAKS: 'streaks',
} as const;

/**
 * Initialize database with required collections and indexes
 */
export async function initializeDatabase(): Promise<void> {
  console.log('Initializing database...');
  
  await connectToDatabase();
  const db = getDatabase();

  // Create collections if they don't exist
  const existingCollections = await db.listCollections().toArray();
  const existingNames = new Set(existingCollections.map(c => c.name));

  for (const collectionName of Object.values(COLLECTIONS)) {
    if (!existingNames.has(collectionName)) {
      await db.createCollection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    }
  }

  // Create indexes
  await createIndexes(db);
  
  console.log('Database initialization complete');
}


import type { Db } from 'mongodb';

/**
 * Create all required indexes for optimal query performance
 */
async function createIndexes(db: Db): Promise<void> {
  console.log('Creating indexes...');

  // Users collection indexes
  const usersCollection = db.collection(COLLECTIONS.USERS);
  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await usersCollection.createIndex({ deletionRequestedAt: 1 }, { sparse: true });

  // User preferences collection indexes
  const preferencesCollection = db.collection(COLLECTIONS.USER_PREFERENCES);
  await preferencesCollection.createIndex({ userId: 1 }, { unique: true });

  // Journal entries collection indexes
  const journalCollection = db.collection(COLLECTIONS.JOURNAL_ENTRIES);
  await journalCollection.createIndex({ userId: 1 });
  await journalCollection.createIndex({ userId: 1, journalDate: 1 });
  await journalCollection.createIndex({ journalDate: 1 });

  // Voice notes collection indexes
  const voiceNotesCollection = db.collection(COLLECTIONS.VOICE_NOTES);
  await voiceNotesCollection.createIndex({ userId: 1 });
  await voiceNotesCollection.createIndex({ journalEntryId: 1 });

  // Kick events collection indexes
  const kicksCollection = db.collection(COLLECTIONS.KICK_EVENTS);
  await kicksCollection.createIndex({ userId: 1 });
  await kicksCollection.createIndex({ userId: 1, timestamp: -1 });
  await kicksCollection.createIndex({ timestamp: -1 });

  // Progress collection indexes
  const progressCollection = db.collection(COLLECTIONS.PROGRESS);
  await progressCollection.createIndex({ userId: 1 });
  await progressCollection.createIndex({ userId: 1, storyId: 1 }, { unique: true });

  // Streaks collection indexes
  const streaksCollection = db.collection(COLLECTIONS.STREAKS);
  await streaksCollection.createIndex({ userId: 1 }, { unique: true });

  console.log('Indexes created successfully');
}

/**
 * Drop all collections (use with caution - for testing only)
 */
export async function dropAllCollections(): Promise<void> {
  const db = getDatabase();
  
  for (const collectionName of Object.values(COLLECTIONS)) {
    try {
      await db.collection(collectionName).drop();
      console.log(`Dropped collection: ${collectionName}`);
    } catch (error) {
      // Collection might not exist, ignore error
    }
  }
}
