# Workout Tracker

A daily workout tracking app built with React Native and Expo. Track your daily workouts with a simple, intuitive interface that resets every day!

## Features

- **Daily Workout List**: View all your workout types in an easy-to-read list
- **One-Tap Completion**: Tap any workout to mark it as complete
- **Daily Reset**: Completed workouts automatically reset each day, giving you a fresh start
- **Custom Workouts**: Add your own workout types with custom names and images
- **Image Selection**: Choose images from your photo library or take new photos
- **Persistent Storage**: Your workouts are saved locally and persist across app restarts
- **Long Press to Delete**: Hold down on any workout to delete it

## How to Use

### Main Screen
- **View Workouts**: See all your workout types listed on the main screen
- **Complete Workout**: Tap on a workout card to mark it as completed (appears with a green checkmark)
- **Uncomplete**: Tap a completed workout again to mark it as incomplete
- **Delete Workout**: Long press on any workout to delete it

### Adding New Workouts
1. Tap the "Add Workout" button at the bottom of the main screen
2. Enter a name for your workout (e.g., "Push-ups", "Running", "Yoga")
3. Tap the image area to select a photo:
   - Choose "Take Photo" to capture a new image
   - Choose "Choose from Library" to select an existing photo
4. Tap "Save Workout" to add it to your daily list

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- Expo CLI

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Tech Stack

- **React Native**: Mobile framework
- **Expo**: Development platform
- **Expo Router**: File-based navigation
- **AsyncStorage**: Local data persistence
- **Expo Image Picker**: Image selection and camera access
- **TypeScript**: Type-safe development

## Project Structure

```
app/
  ├── _layout.tsx          # Navigation configuration
  ├── index.tsx            # Main workout list screen
  └── add-workout.tsx      # Add new workout screen

hooks/
  └── useWorkouts.ts       # Custom hook for workout management

types/
  └── workout.ts           # TypeScript interfaces

assets/
  └── images/              # App images and icons
```

## How It Works

### Daily Reset
The app automatically detects when a new day begins and resets all workout completions. The completion status is stored with the current date, and when the app loads, it checks if the stored date matches today's date. If not, the completion list is cleared.

### Data Storage
- **Workouts**: Stored in AsyncStorage with workout details (id, name, image URI, creation date)
- **Daily Completions**: Stored separately with the date and list of completed workout IDs
- Data persists across app restarts and updates in real-time

## License

MIT