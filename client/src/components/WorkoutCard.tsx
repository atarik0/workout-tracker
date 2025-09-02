import React, { useState } from 'react';
import { Workout, api, ApiError } from '../lib/api';

interface WorkoutCardProps {
  workout: Workout;
  onUpdate: () => void;
  onDelete: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState({
    duration: workout.duration,
    calories: workout.calories || '',
    notes: workout.notes || ''
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTypeLabel = (type: string) => {
    const types = {
      strength: 'Güç',
      cardio: 'Kardiyovasküler',
      mobility: 'Mobilite',
      other: 'Diğer'
    };
    return types[type as keyof typeof types] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      strength: 'bg-red-100 text-red-800',
      cardio: 'bg-blue-100 text-blue-800',
      mobility: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleUpdate = async () => {
    if (!workout._id) return;
    
    setIsLoading(true);
    try {
      await api.updateWorkout(workout._id, {
        duration: Number(editData.duration),
        calories: editData.calories ? Number(editData.calories) : undefined,
        notes: editData.notes || undefined
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Update failed:', error);
      alert(error instanceof ApiError ? error.message : 'Güncelleme başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!workout._id) return;
    
    if (!confirm('Bu antrenman kaydını silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await api.deleteWorkout(workout._id);
      onDelete();
    } catch (error) {
      console.error('Delete failed:', error);
      alert(error instanceof ApiError ? error.message : 'Silme işlemi başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      duration: workout.duration,
      calories: workout.calories || '',
      notes: workout.notes || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(workout.type)}`}>
              {getTypeLabel(workout.type)}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(workout.date)}
            </span>
          </div>
        </div>
        
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="btn-secondary text-xs px-3 py-1 h-8"
            >
              Düzenle
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="btn-danger text-xs px-3 py-1 h-8"
            >
              Sil
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="label">Süre (dakika)</label>
            <input
              type="number"
              min="1"
              value={editData.duration}
              onChange={(e) => setEditData(prev => ({ ...prev, duration: Number(e.target.value) }))}
              className="input mt-1"
              required
            />
          </div>
          
          <div>
            <label className="label">Kalori (isteğe bağlı)</label>
            <input
              type="number"
              min="0"
              value={editData.calories}
              onChange={(e) => setEditData(prev => ({ ...prev, calories: e.target.value }))}
              className="input mt-1"
              placeholder="Örn: 250"
            />
          </div>
          
          <div>
            <label className="label">Notlar (isteğe bağlı)</label>
            <textarea
              value={editData.notes}
              onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
              className="input mt-1 min-h-[80px] resize-none"
              placeholder="Antrenman hakkında notlarınız..."
              maxLength={500}
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleUpdate}
              disabled={isLoading || !editData.duration || editData.duration < 1}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Güncelleniyor...' : 'Kaydet'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              İptal
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">⏱️ {workout.duration} dk</span>
            </div>
            {workout.calories && (
              <div className="flex items-center gap-1">
                <span className="font-medium">🔥 {workout.calories} kcal</span>
              </div>
            )}
          </div>
          
          {workout.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                {workout.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;
