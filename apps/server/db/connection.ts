import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import { config } from '../config/index.js';

// Connection state
let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;

// Connection options with pooling
const connectionOptions: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * Calculate delay for exponential backoff
 */
function calculateBackoffDelay(attempt: number): number {
  const delay = RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelayMs);
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Connect to MongoDB with retry logic
 */
export async function connectToDatabase(): Promise<Db> {
  // Return existing connection if available
  if (db && client) {
    return db;
  }

  // Prevent concurrent connection attempts
  if (isConnecting) {
    // Wait for the ongoing connection attempt
    while (isConnecting) {
      await sleep(100);
    }
    if (db) {
      return db;
    }
  }

  isConnecting = true;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxRetries; attempt++) {
    try {
      console.log(`MongoDB connection attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries}...`);
      
      client = new MongoClient(config.mongodb.uri, connectionOptions);
      await client.connect();
      
      db = client.db(config.mongodb.dbName);
      
      // Verify connection with a ping
      await db.command({ ping: 1 });
      
      console.log(`Successfully connected to MongoDB: ${config.mongodb.dbName}`);
      
      // Set up connection event handlers
      client.on('close', () => {
        console.warn('MongoDB connection closed');
        db = null;
      });

      client.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });

      client.on('timeout', () => {
        console.warn('MongoDB connection timeout');
      });

      isConnecting = false;
      return db;
    } catch (error) {
      lastError = error as Error;
      console.error(`MongoDB connection attempt ${attempt + 1} failed:`, lastError.message);
      
      // Clean up failed connection
      if (client) {
        try {
          await client.close();
        } catch {
          // Ignore close errors
        }
        client = null;
      }
      
      // Wait before retrying (except on last attempt)
      if (attempt < RETRY_CONFIG.maxRetries - 1) {
        const delay = calculateBackoffDelay(attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  isConnecting = false;
  throw new Error(
    `Failed to connect to MongoDB after ${RETRY_CONFIG.maxRetries} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Get the database instance (must be connected first)
 */
export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}

/**
 * Get the MongoClient instance (must be connected first)
 */
export function getClient(): MongoClient {
  if (!client) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return client;
}

/**
 * Check if database is connected
 */
export function isConnected(): boolean {
  return db !== null && client !== null;
}

/**
 * Close the database connection
 */
export async function closeConnection(): Promise<void> {
  if (client) {
    try {
      await client.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    } finally {
      client = null;
      db = null;
    }
  }
}

/**
 * Health check for the database connection
 */
export async function healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
  try {
    if (!db || !client) {
      return { status: 'unhealthy', message: 'Not connected to database' };
    }
    
    await db.command({ ping: 1 });
    return { status: 'healthy', message: 'Database connection is healthy' };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      message: `Database health check failed: ${(error as Error).message}` 
    };
  }
}
