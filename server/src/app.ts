import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import workoutRoutes from './routes/workouts';
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';

const app = express();

// CORS configuration
const corsOptions = {
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/workouts', workoutRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

export default app;
