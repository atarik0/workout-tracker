import { useState } from 'react';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWorkoutAdded = () => {
    // Trigger a refresh of the workout list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleWorkoutUpdate = () => {
    // This can be used for additional actions when workouts are updated/deleted
    // Currently, WorkoutList handles its own refresh
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🏋️ Workout Tracker
              </h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                v1.0
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Antrenmanlarınızı takip edin
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <WorkoutForm onSubmitSuccess={handleWorkoutAdded} />
          </div>

          {/* Right Panel - List */}
          <div>
            <WorkoutList 
              refreshTrigger={refreshTrigger} 
              onWorkoutUpdate={handleWorkoutUpdate}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>
              Workout Tracker - Modern antrenman takip uygulaması
            </p>
            <p className="mt-1">
              React, TypeScript, Express ve MongoDB ile geliştirilmiştir
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
