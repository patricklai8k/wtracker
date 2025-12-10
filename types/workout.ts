export interface Workout {
  id: string;
  name: string;
  imageUri: string;
  createdAt: string;
}

export interface DailyCompletion {
  date: string; // YYYY-MM-DD format
  completedWorkoutIds: string[];
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD format
  count: number; // number of workouts completed
}
