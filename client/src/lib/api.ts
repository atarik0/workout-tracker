const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

export interface Workout {
  _id?: string;
  date: string;
  type: 'strength' | 'cardio' | 'mobility' | 'other';
  duration: number;
  calories?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  statusCode?: number;
}

class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong', response.status);
  }
  
  return data;
};

export const api = {
  // Get all workouts
  getWorkouts: async (): Promise<ApiResponse<Workout[]>> => {
    const response = await fetch(`${BASE_URL}/api/workouts`);
    return handleResponse<ApiResponse<Workout[]>>(response);
  },

  // Get single workout
  getWorkout: async (id: string): Promise<ApiResponse<Workout>> => {
    const response = await fetch(`${BASE_URL}/api/workouts/${id}`);
    return handleResponse<ApiResponse<Workout>>(response);
  },

  // Create new workout
  createWorkout: async (workout: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Workout>> => {
    const response = await fetch(`${BASE_URL}/api/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    return handleResponse<ApiResponse<Workout>>(response);
  },

  // Update workout
  updateWorkout: async (id: string, workout: Partial<Workout>): Promise<ApiResponse<Workout>> => {
    const response = await fetch(`${BASE_URL}/api/workouts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    return handleResponse<ApiResponse<Workout>>(response);
  },

  // Delete workout
  deleteWorkout: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/workouts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(data.message || 'Failed to delete workout', response.status);
    }
  },
};

export { ApiError };
