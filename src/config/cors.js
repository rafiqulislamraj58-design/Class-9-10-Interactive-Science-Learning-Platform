
import { env } from './env.js';

export const corsOptions = {
  origin: [
    env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ],
  credentials: true,
  methods: [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
  ],
};
