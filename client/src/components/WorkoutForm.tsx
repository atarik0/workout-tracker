import React, { useState } from 'react';
import { api, ApiError } from '../lib/api';

interface WorkoutFormProps {
  onSubmitSuccess: () => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    type: 'strength' as const,
    duration: '',
    calories: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const workoutTypes = [
    { value: 'strength', label: 'Güç Antrenmanı', icon: '🏋️' },
    { value: 'cardio', label: 'Kardiyovasküler', icon: '🏃' },
    { value: 'mobility', label: 'Mobilite', icon: '🧘' },
    { value: 'other', label: 'Diğer', icon: '⚡' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.date) {
      return 'Tarih gereklidir';
    }
    
    if (!formData.duration || Number(formData.duration) < 1) {
      return 'Süre en az 1 dakika olmalıdır';
    }
    
    if (formData.calories && Number(formData.calories) < 0) {
      return 'Kalori negatif olamaz';
    }
    
    if (formData.notes && formData.notes.length > 500) {
      return 'Notlar 500 karakteri geçemez';
    }
    
    return null;
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'strength',
      duration: '',
      calories: '',
      notes: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const workoutData = {
        date: formData.date,
        type: formData.type,
        duration: Number(formData.duration),
        calories: formData.calories ? Number(formData.calories) : undefined,
        notes: formData.notes || undefined
      };
      
      await api.createWorkout(workoutData);
      
      setMessage({ type: 'success', text: 'Antrenman başarıyla kaydedildi!' });
      resetForm();
      onSubmitSuccess();
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error) {
      console.error('Submit failed:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof ApiError ? error.message : 'Kayıt başarısız oldu. Lütfen tekrar deneyin.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Yeni Antrenman Ekle</h2>
      
      {message && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tarih */}
        <div>
          <label htmlFor="date" className="label">
            Tarih *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="input mt-1"
            required
            max={new Date().toISOString().split('T')[0]} // Cannot select future dates
          />
        </div>

        {/* Antrenman Türü */}
        <div>
          <label htmlFor="type" className="label">
            Antrenman Türü *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="input mt-1"
            required
          >
            {workoutTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Süre */}
        <div>
          <label htmlFor="duration" className="label">
            Süre (dakika) *
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="input mt-1"
            placeholder="Örn: 45"
            min="1"
            required
          />
        </div>

        {/* Kalori */}
        <div>
          <label htmlFor="calories" className="label">
            Kalori (isteğe bağlı)
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleInputChange}
            className="input mt-1"
            placeholder="Örn: 250"
            min="0"
          />
        </div>

        {/* Notlar */}
        <div>
          <label htmlFor="notes" className="label">
            Notlar (isteğe bağlı)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            className="input mt-1 min-h-[100px] resize-none"
            placeholder="Antrenman hakkında notlarınız..."
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.notes.length}/500 karakter
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Kaydediliyor...
            </>
          ) : (
            'Antrenmanı Kaydet'
          )}
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;
