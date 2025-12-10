import { useTheme } from '@/hooks/useTheme';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddWorkout() {
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [useIcon, setUseIcon] = useState(true); // true for icon, false for custom image
  const { addWorkout } = useWorkouts();
  const { colors } = useTheme();

  // Predefined workout icons
  const workoutIcons = [
    { name: 'barbell', label: 'Weights' },
    { name: 'fitness', label: 'Gym' },
    { name: 'bicycle', label: 'Cycling' },
    { name: 'walk', label: 'Walking' },
    { name: 'basketball', label: 'Basketball' },
    { name: 'football', label: 'Football' },
    { name: 'tennisball', label: 'Tennis' },
    { name: 'water', label: 'Swimming' },
    { name: 'body', label: 'Cardio' },
    { name: 'play', label: 'Running' },
    { name: 'heart', label: 'Heart Rate' },
    { name: 'pulse', label: 'Pulse' },
    { name: 'snow', label: 'Yoga' },
    { name: 'hand-left', label: 'Boxing' },
    { name: 'flag', label: 'Goal' },
    { name: 'medal', label: 'Achievement' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Choose Icon', onPress: () => setUseIcon(true) },
        { text: 'Take Photo', onPress: () => { setUseIcon(false); takePhoto(); } },
        { text: 'Choose from Library', onPress: () => { setUseIcon(false); pickImage(); } },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a workout name.');
      return;
    }

    if (!imageUri && !selectedIcon) {
      Alert.alert('Error', 'Please select an icon or image for the workout.');
      return;
    }

    await addWorkout({
      name: name.trim(),
      imageUri: useIcon ? `icon:${selectedIcon}` : imageUri,
    });

    Alert.alert('Success', 'Workout added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
            <Text style={[styles.label, { color: colors.text }]}>Workout Icon/Image</Text>
            
            {/* Tab selector */}
            <View style={[styles.tabContainer, { backgroundColor: colors.tabBackground }]}>
              <TouchableOpacity 
                style={[styles.tab, useIcon && { ...styles.tabActive, backgroundColor: colors.card }]}
                onPress={() => setUseIcon(true)}
              >
                <Text style={[styles.tabText, { color: colors.textSecondary }, useIcon && { color: colors.primary, fontWeight: '600' }]}>Icon</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, !useIcon && { ...styles.tabActive, backgroundColor: colors.card }]}
                onPress={() => setUseIcon(false)}
              >
                <Text style={[styles.tabText, { color: colors.textSecondary }, !useIcon && { color: colors.primary, fontWeight: '600' }]}>Custom Image</Text>
              </TouchableOpacity>
            </View>

            {useIcon ? (
              /* Icon Grid */
              <View style={[styles.iconGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {workoutIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon.name}
                    style={[
                      styles.iconButton,
                      { backgroundColor: colors.placeholder, borderColor: colors.border },
                      selectedIcon === icon.name && { backgroundColor: colors.iconBackground, borderColor: colors.iconBorder }
                    ]}
                    onPress={() => setSelectedIcon(icon.name)}
                  >
                    <Ionicons 
                      name={icon.name as any} 
                      size={32} 
                      color={selectedIcon === icon.name ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.iconLabel,
                      { color: colors.textSecondary },
                      selectedIcon === icon.name && { color: colors.primary, fontWeight: '600' }
                    ]}>
                      {icon.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              /* Custom Image Selector */
              <>
                <TouchableOpacity 
                  style={[styles.imageSelector, { borderColor: colors.border }]}
                  onPress={showImageOptions}
                >
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                  ) : (
                    <View style={[styles.imagePlaceholder, { backgroundColor: colors.placeholder }]}>
                      <Ionicons name="image-outline" size={48} color={colors.textTertiary} />
                      <Text style={[styles.imagePlaceholderText, { color: colors.textTertiary }]}>Tap to select image</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {imageUri && (
                  <TouchableOpacity 
                    style={styles.changeImageButton}
                    onPress={showImageOptions}
                  >
                    <Text style={[styles.changeImageText, { color: colors.primary }]}>Change Image</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.success }]} onPress={handleSave}>
          <Ionicons name="checkmark" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
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
  input: {
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  imageSelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 16,
  },
  changeImageButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  changeImageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
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
  iconLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
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
