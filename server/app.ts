import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware, helmetMiddleware, generalRateLimiter, sanitizeInput } from './middleware/index.js';
import routes from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // Trust proxy - required when running behind nginx/reverse proxy
  // This ensures rate limiting and IP detection work correctly
  app.set('trust proxy', 1);

  // Security middleware
  app.use(helmetMiddleware);
  app.use(corsMiddleware);

  // Rate limiting
  app.use(generalRateLimiter);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Cookie parsing
  app.use(cookieParser());

  // Input sanitization - escape HTML entities and prevent NoSQL injection
  app.use(sanitizeInput);

  // API routes
  app.use('/api', routes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
    });
  });

  return app;
}
