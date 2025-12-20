import { createApp } from './app.js';
import { config } from './config/index.js';
import { connectToDatabase, initializeDatabase, closeConnection } from './db/index.js';
import { startAccountDeletionJob, stopAccountDeletionJob } from './jobs/index.js';

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Initialize database collections and indexes
    await initializeDatabase();
    
    // Create and start Express app
    const app = createApp();

    // Start scheduled jobs
    startAccountDeletionJob();

    const server = app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
      console.log(`Environment: ${config.server.nodeEnv}`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      
      // Stop scheduled jobs
      stopAccountDeletionJob();
      
      server.close(async () => {
        console.log('HTTP server closed');
        await closeConnection();
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
