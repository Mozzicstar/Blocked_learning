import Fastify from 'fastify';
import cors from '@fastify/cors';
import { initializeDatabase, testConnection } from './db/client.js';
import { authRoutes } from './routes/auth.js';
import { courseRoutes } from './routes/courses.js';
import { progressRoutes } from './routes/progress.js';
import { mentorRoutes } from './routes/mentor.js';
import { contentRoutes } from './routes/content.js';

const app = Fastify({
  logger: {
    level: process.env.DEBUG === 'true' ? 'debug' : 'info'
  }
});

// Register CORS
app.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
});

// Initialize database
app.addHook('onReady', async () => {
  try {
    const connected = await testConnection();
    if (connected) {
      await initializeDatabase();
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    app.log.error({ err: error }, `Failed to initialize database: ${errorMsg}`);
  }
});
// Register routes
app.register(authRoutes);
app.register(courseRoutes);
app.register(progressRoutes);
app.register(mentorRoutes);
app.register(contentRoutes);

// Health check endpoint
app.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BLOCKEDLEARNING Backend'
  };
});

// Root endpoint
app.get('/', async () => {
  return {
    message: 'BLOCKEDLEARNING Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  };
});

// Error handler
app.setErrorHandler((error: any, request, reply) => {
  app.log.error(error);
  reply.status(error?.statusCode || 500).send({
    statusCode: error?.statusCode || 500,
    message: error?.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

export default app;
