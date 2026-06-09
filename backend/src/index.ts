import { buildApp } from './app.js';
import { env } from './config/env.js';
import { db } from './config/database.js';
import { redisClient } from './config/redis.js';
import { logger } from './middleware/logger.js';
import { startScheduler } from './jobs/scheduler.js';

async function main() {
  try {
    // Initialize database connection
    await db.connect();
    logger.info('Database connected successfully');

    // Initialize Redis connection
    await redisClient.connect();
    logger.info('Redis connected successfully');

    // Build Fastify application
    const app = await buildApp();

    // Start background job scheduler
    startScheduler();
    logger.info('Background job scheduler started');

    // Start server
    const port = env.PORT;
    const host = env.HOST;

    await app.listen({ port, host });
    
    logger.info(`🌱 Carbon Footprint Platform server running at http://${host}:${port}`);
    logger.info(`📊 Environment: ${env.NODE_ENV}`);

    // Graceful shutdown
    const shutdownSignals = ['SIGINT', 'SIGTERM'];
    
    for (const signal of shutdownSignals) {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        
        try {
          await app.close();
          await redisClient.quit();
          await db.end();
          
          logger.info('Server shut down successfully');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
