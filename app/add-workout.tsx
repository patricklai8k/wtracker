import { useTheme } from '@/hooks/useTheme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const workoutIcons = [
  'barbell',
  'fitness',
  'bicycle',
  'walk',
  'basketball',
  'football',
  'tennisball',
  'water',
  'body',
  'pulse',
] as const;

type WorkoutIconName = (typeof workoutIcons)[number];

export default function AddWorkout() {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<WorkoutIconName | ''>('');
  const { addWorkout } = useWorkouts();
  const { colors } = useTheme();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a workout name.');
      return;
    }

    if (!selectedIcon) {
      Alert.alert('Error', 'Please select an icon for the workout.');
      return;
    }

    await addWorkout({
      name: name.trim(),
      imageUri: `icon:${selectedIcon}`,
    });

    Alert.alert('Success', 'Workout added successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          contentContainerStyle={[
            styles.scrollContent,
            { backgroundColor: colors.background, flexGrow: 1 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Add New Workout</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Workout Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
              placeholder="e.g., Push-ups, Running, Yoga"
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Workout Icon</Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>Choose the icon that best represents this workout.</Text>

            <View style={[styles.iconGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {workoutIcons.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.placeholder, borderColor: colors.border },
                    selectedIcon === iconName && { backgroundColor: colors.iconBackground, borderColor: colors.iconBorder },
                  ]}
                  onPress={() => setSelectedIcon(iconName)}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${iconName} icon`}
                  accessibilityState={{ selected: selectedIcon === iconName }}
                >
                  <Ionicons
                    name={iconName}
                    size={34}
                    color={selectedIcon === iconName ? colors.primary : colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.success }]} onPress={handleSave}>
            <Ionicons name="checkmark" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>Save Workout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    minHeight: '100%',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    marginBottom: 12,
  },
  input: {
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    padding: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
