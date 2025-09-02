import mongoose, { Document, Schema } from 'mongoose';

export enum WorkoutType {
  STRENGTH = 'strength',
  CARDIO = 'cardio',
  MOBILITY = 'mobility',
  OTHER = 'other'
}

export interface IWorkout extends Document {
  date: Date;
  type: WorkoutType;
  duration: number;
  calories?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    type: {
      type: String,
      enum: Object.values(WorkoutType),
      required: [true, 'Type is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute']
    },
    calories: {
      type: Number,
      min: [0, 'Calories cannot be negative'],
      required: false
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IWorkout>('Workout', WorkoutSchema);
