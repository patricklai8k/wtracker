import ActivityTracker from '@/components/ActivityTracker';
import { useTheme } from '@/hooks/useTheme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const { workouts, completedIds, activityHistory, loading, toggleCompletion, deleteWorkout, reload } = useWorkouts();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // Reload workouts when screen comes into focus (e.g., after adding a new workout)
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Workout',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteWorkout(id)
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Daily Workouts</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      <ActivityTracker 
        activityHistory={activityHistory} 
        currentCompletedCount={completedIds.length}
        isDark={isDark}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No workouts yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Add your first workout to get started!</Text>
          </View>
        ) : (
          workouts.map((workout) => {
            const isCompleted = completedIds.includes(workout.id);
            const isIcon = workout.imageUri.startsWith('icon:');
            const iconName = isIcon ? workout.imageUri.replace('icon:', '') : '';
            
            return (
              <TouchableOpacity
                key={workout.id}
                style={[
                  styles.workoutCard, 
                  { backgroundColor: colors.card, borderColor: colors.border },
                  isCompleted && { backgroundColor: colors.successLight, borderColor: colors.success }
                ]}
                onPress={() => toggleCompletion(workout.id)}
                onLongPress={() => handleDelete(workout.id, workout.name)}
              >
                {isIcon ? (
                  <View style={[
                    styles.workoutIconContainer, 
                    { 
                      backgroundColor: isCompleted ? colors.successLight : colors.iconBackground,
                      borderColor: isCompleted ? colors.success : colors.iconBorder 
                    }
                  ]}>
                    <Ionicons 
                      name={iconName as any} 
                      size={36} 
                      color={isCompleted ? colors.success : colors.primary} 
                    />
                  </View>
                ) : (
                  <Image 
                    source={{ uri: workout.imageUri }} 
                    style={styles.workoutImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.workoutInfo}>
                  <Text style={[
                    styles.workoutName, 
                    { color: isCompleted ? colors.success : colors.text }
                  ]}>
                    {workout.name}
                  </Text>
                  {isCompleted && (
                    <Text style={[styles.completedText, { color: colors.success }]}>✓ Completed</Text>
                  )}
                </View>
                {isCompleted && (
                  <Ionicons name="checkmark-circle" size={32} color={colors.success} />
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/add-workout')}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.addButtonText}>Add Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addIcon: {
    alignSelf: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  workoutCard: {
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  workoutImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  workoutIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedText: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
