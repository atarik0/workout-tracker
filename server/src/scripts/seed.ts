import { connectDB, disconnectDB } from '../config/db';
import Workout, { WorkoutType } from '../models/Workout';

const seedData = [
  {
    date: new Date('2024-01-15'),
    type: WorkoutType.STRENGTH,
    duration: 45,
    calories: 280,
    notes: 'Upper body strength training - chest, shoulders, triceps'
  },
  {
    date: new Date('2024-01-16'),
    type: WorkoutType.CARDIO,
    duration: 30,
    calories: 350,
    notes: 'Morning run in the park, felt great!'
  },
  {
    date: new Date('2024-01-17'),
    type: WorkoutType.MOBILITY,
    duration: 20,
    calories: 80,
    notes: 'Yoga session focusing on flexibility and relaxation'
  }
];

const seed = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Workout.deleteMany({});
    console.log('📊 Cleared existing workouts');
    
    // Insert seed data
    const workouts = await Workout.insertMany(seedData);
    console.log(`🌱 Successfully seeded ${workouts.length} workouts:`);
    
    workouts.forEach((workout, index) => {
      console.log(`   ${index + 1}. ${workout.type.toUpperCase()} - ${workout.duration} min - ${workout.date.toDateString()}`);
    });
    
    console.log('✅ Seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

// Run seed if called directly
if (require.main === module) {
  seed();
}

export default seed;
