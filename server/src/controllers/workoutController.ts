import { Request, Response, NextFunction } from 'express';
import Workout, { IWorkout } from '../models/Workout';

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Public
export const getWorkouts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workouts = await Workout.find({}).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Public
export const getWorkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Public
export const createWorkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, type, duration, calories, notes } = req.body;

    // Basic validation
    if (!date || !type || !duration) {
      res.status(400).json({
        success: false,
        message: 'Date, type, and duration are required'
      });
      return;
    }

    if (duration < 1) {
      res.status(400).json({
        success: false,
        message: 'Duration must be at least 1 minute'
      });
      return;
    }

    if (calories !== undefined && calories < 0) {
      res.status(400).json({
        success: false,
        message: 'Calories cannot be negative'
      });
      return;
    }

    const workout = await Workout.create({
      date,
      type,
      duration,
      calories,
      notes
    });

    res.status(201).json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Public
export const updateWorkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { duration, calories } = req.body;

    // Validation for update
    if (duration !== undefined && duration < 1) {
      res.status(400).json({
        success: false,
        message: 'Duration must be at least 1 minute'
      });
      return;
    }

    if (calories !== undefined && calories < 0) {
      res.status(400).json({
        success: false,
        message: 'Calories cannot be negative'
      });
      return;
    }

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!workout) {
      res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: workout
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Public
export const deleteWorkout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);

    if (!workout) {
      res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
      return;
    }

    res.status(204).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
