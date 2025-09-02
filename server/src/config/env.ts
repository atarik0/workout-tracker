import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5173,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workout_tracker',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5174'
};
