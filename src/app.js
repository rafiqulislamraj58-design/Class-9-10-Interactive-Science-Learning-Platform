import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/cors.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { notFoundHandler } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import v1Routes from './routes/v1/index.js';

const app = express();

// Security & Utility Middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply Rate Limiting to all API routes
app.use('/api', apiLimiter);

// API Routes v1
app.use('/api/v1', v1Routes);

// 404 & Global Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);
app.get('/', (req, res) => res.json({ message: 'NCTB Science Platform API is running!' }));

export default app;