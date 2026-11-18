import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Origin control
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Basic Health Route (Phase 1 Requirement)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    },
    meta: null
  });
});

// Handle 404 Not Found (Placeholder)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null
  });
});

export default app;