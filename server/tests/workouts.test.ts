import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/app';
import Workout, { WorkoutType } from '../src/models/Workout';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Cleanup
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the database before each test
  await Workout.deleteMany({});
});

describe('Workout API', () => {
  const validWorkout = {
    date: '2024-01-15T00:00:00.000Z',
    type: WorkoutType.STRENGTH,
    duration: 45,
    calories: 280,
    notes: 'Test workout'
  };

  describe('POST /api/workouts', () => {
    it('should create a new workout with valid data', async () => {
      const response = await request(app)
        .post('/api/workouts')
        .send(validWorkout);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.type).toBe(validWorkout.type);
      expect(response.body.data.duration).toBe(validWorkout.duration);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidWorkout = {
        type: WorkoutType.CARDIO,
        // missing date and duration
      };

      const response = await request(app)
        .post('/api/workouts')
        .send(invalidWorkout);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 400 for invalid duration', async () => {
      const invalidWorkout = {
        ...validWorkout,
        duration: 0 // invalid duration
      };

      const response = await request(app)
        .post('/api/workouts')
        .send(invalidWorkout);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Duration must be at least 1 minute');
    });

    it('should return 400 for negative calories', async () => {
      const invalidWorkout = {
        ...validWorkout,
        calories: -10 // invalid calories
      };

      const response = await request(app)
        .post('/api/workouts')
        .send(invalidWorkout);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Calories cannot be negative');
    });
  });

  describe('GET /api/workouts', () => {
    it('should return empty array when no workouts exist', async () => {
      const response = await request(app)
        .get('/api/workouts');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    it('should return workouts sorted by date (desc) after seeding', async () => {
      // Create test workouts
      const workout1 = await Workout.create({
        ...validWorkout,
        date: '2024-01-15'
      });
      
      const workout2 = await Workout.create({
        ...validWorkout,
        date: '2024-01-16',
        type: WorkoutType.CARDIO
      });

      const response = await request(app)
        .get('/api/workouts');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
      // Should be sorted by date desc (newest first)
      expect(new Date(response.body.data[0].date).getTime())
        .toBeGreaterThan(new Date(response.body.data[1].date).getTime());
    });
  });

  describe('GET /api/workouts/:id', () => {
    it('should return a specific workout', async () => {
      const workout = await Workout.create(validWorkout);

      const response = await request(app)
        .get(`/api/workouts/${workout._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(workout._id.toString());
    });

    it('should return 404 for non-existent workout', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/workouts/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Workout not found');
    });
  });

  describe('PUT /api/workouts/:id', () => {
    it('should update a workout successfully', async () => {
      const workout = await Workout.create(validWorkout);
      const updateData = {
        duration: 60,
        calories: 400
      };

      const response = await request(app)
        .put(`/api/workouts/${workout._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.duration).toBe(60);
      expect(response.body.data.calories).toBe(400);
    });

    it('should return 404 for non-existent workout', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/workouts/${fakeId}`)
        .send({ duration: 60 });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Workout not found');
    });
  });

  describe('DELETE /api/workouts/:id', () => {
    it('should delete a workout successfully', async () => {
      const workout = await Workout.create(validWorkout);

      const response = await request(app)
        .delete(`/api/workouts/${workout._id}`);

      expect(response.status).toBe(204);
      
      // Verify workout is deleted
      const deletedWorkout = await Workout.findById(workout._id);
      expect(deletedWorkout).toBeNull();
    });

    it('should return 404 for non-existent workout', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/workouts/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Workout not found');
    });
  });
});
