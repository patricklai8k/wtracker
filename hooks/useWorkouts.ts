import { ActivityDay, DailyCompletion, Workout } from '@/types/workout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

const { WorkoutWidget } = NativeModules;

const WORKOUTS_KEY = '@workouts';
const DAILY_COMPLETION_KEY = '@daily_completion';
const ACTIVITY_HISTORY_KEY = '@activity_history';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [activityHistory, setActivityHistory] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const loadData = async () => {
    try {
      const [workoutsData, completionData, historyData] = await Promise.all([
        AsyncStorage.getItem(WORKOUTS_KEY),
        AsyncStorage.getItem(DAILY_COMPLETION_KEY),
        AsyncStorage.getItem(ACTIVITY_HISTORY_KEY),
      ]);

      if (workoutsData) {
        setWorkouts(JSON.parse(workoutsData));
      }

      if (historyData) {
        setActivityHistory(JSON.parse(historyData));
      }

      const today = getTodayDate();
      if (completionData) {
        const completion: DailyCompletion = JSON.parse(completionData);
        // Reset if it's a new day
        if (completion.date === today) {
          setCompletedIds(completion.completedWorkoutIds);
        } else {
          // Save previous day's count to history before resetting
          if (completion.completedWorkoutIds.length > 0) {
            await updateActivityHistory(completion.date, completion.completedWorkoutIds.length);
          }
          setCompletedIds([]);
          await saveCompletion([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveWorkouts = async (updatedWorkouts: Workout[]) => {
    try {
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Error saving workouts:', error);
    }
  };

  const saveCompletion = async (ids: string[]) => {
    try {
      const completion: DailyCompletion = {
        date: getTodayDate(),
        completedWorkoutIds: ids,
      };
      await AsyncStorage.setItem(DAILY_COMPLETION_KEY, JSON.stringify(completion));

      // Update today's activity count in history
      await updateActivityHistory(getTodayDate(), ids.length);

      // Update Android widget
      if (Platform.OS === 'android' && WorkoutWidget) {
        try {
          WorkoutWidget.updateWidget();
        } catch (error) {
          console.warn('Failed to update widget:', error);
        }
      }
    } catch (error) {
      console.error('Error saving completion:', error);
    }
  };

  const updateActivityHistory = async (date: string, count: number) => {
    try {
      const historyData = await AsyncStorage.getItem(ACTIVITY_HISTORY_KEY);
      let history: ActivityDay[] = historyData ? JSON.parse(historyData) : [];

      // Update or add the day's count
      const existingIndex = history.findIndex(day => day.date === date);
      if (existingIndex >= 0) {
        history[existingIndex].count = count;
      } else {
        history.push({ date, count });
      }

      // Keep only last 90 days of history
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      history = history.filter(day => new Date(day.date) >= ninetyDaysAgo);

      await AsyncStorage.setItem(ACTIVITY_HISTORY_KEY, JSON.stringify(history));
      setActivityHistory(history);
    } catch (error) {
      console.error('Error updating activity history:', error);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'createdAt'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedWorkouts = [...workouts, newWorkout];
    await saveWorkouts(updatedWorkouts);

    // Update Android widget
    if (Platform.OS === 'android' && WorkoutWidget) {
      try {
        WorkoutWidget.updateWidget();
      } catch (error) {
        console.warn('Failed to update widget:', error);
      }
    }
  };

  const toggleCompletion = async (workoutId: string) => {
    const newCompletedIds = completedIds.includes(workoutId)
      ? completedIds.filter(id => id !== workoutId)
      : [...completedIds, workoutId];

    setCompletedIds(newCompletedIds);
    await saveCompletion(newCompletedIds);
  };

  const deleteWorkout = async (workoutId: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    await saveWorkouts(updatedWorkouts);

    // Also remove from completed if it was completed
    if (completedIds.includes(workoutId)) {
      const newCompletedIds = completedIds.filter(id => id !== workoutId);
      setCompletedIds(newCompletedIds);
      await saveCompletion(newCompletedIds);
    }

    // Update Android widget
    if (Platform.OS === 'android' && WorkoutWidget) {
      try {
        WorkoutWidget.updateWidget();
      } catch (error) {
        console.warn('Failed to update widget:', error);
      }
    }
  };

  return {
    workouts,
    completedIds,
    activityHistory,
    loading,
    addWorkout,
    toggleCompletion,
    deleteWorkout,
    reload: loadData,
  };
}
