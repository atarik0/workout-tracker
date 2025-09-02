import React, { useState, useEffect } from 'react';
import { Workout, api, ApiError } from '../lib/api';
import WorkoutCard from './WorkoutCard';

interface WorkoutListProps {
  refreshTrigger: number;
  onWorkoutUpdate: () => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ refreshTrigger, onWorkoutUpdate }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.getWorkouts();
      setWorkouts(response.data || []);
    } catch (error) {
      console.error('Failed to load workouts:', error);
      setError(error instanceof ApiError ? error.message : 'Antrenmanlar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [refreshTrigger]);

  const handleWorkoutUpdate = () => {
    loadWorkouts();
    onWorkoutUpdate();
  };

  const getTotalStats = () => {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const totalCalories = workouts.reduce((sum, workout) => sum + (workout.calories || 0), 0);
    
    return { totalWorkouts, totalDuration, totalCalories };
  };

  const stats = getTotalStats();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Antrenman Geçmişi</h2>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Antrenman Geçmişi</h2>
          <div className="alert-error">
            <p>{error}</p>
            <button 
              onClick={loadWorkouts}
              className="btn-primary mt-3"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Antrenman Geçmişi</h2>
        
        {workouts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</div>
              <div className="text-sm text-gray-600">Toplam Antrenman</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalDuration}</div>
              <div className="text-sm text-gray-600">Toplam Dakika</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCalories}</div>
              <div className="text-sm text-gray-600">Toplam Kalori</div>
            </div>
          </div>
        )}

        {workouts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz antrenman kaydınız yok
            </h3>
            <p className="text-gray-600">
              İlk antrenmanınızı eklemek için sol paneli kullanın.
            </p>
          </div>
        ) : (
          <div className="text-sm text-gray-600 mb-4">
            {workouts.length} antrenman bulundu (en yeni önce)
          </div>
        )}
      </div>

      {/* Antrenman Listesi */}
      {workouts.length > 0 && (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout._id}
              workout={workout}
              onUpdate={handleWorkoutUpdate}
              onDelete={handleWorkoutUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
