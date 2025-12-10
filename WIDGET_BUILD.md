# Workout Tracker Widget - Build Instructions

## Prerequisites
- Node.js and npm installed
- Android Studio installed with Android SDK
- Physical Android device or emulator

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install the new dependencies:
- `expo-dev-client` - Required for native modules
- `expo-build-properties` - For Android build configuration

### 2. Generate Native Android Project
```bash
npx expo prebuild --clean
```

This command:
- Generates the native `android/` project files
- Applies the widget config plugin
- Adds WorkoutWidgetProvider to AndroidManifest.xml
- Registers WorkoutWidgetPackage in MainApplication.kt

### 3. Build and Run on Android

#### Option A: Using Expo (Recommended for development)
```bash
npx expo run:android
```

#### Option B: Using Android Studio
1. Open the `android/` folder in Android Studio
2. Connect your device or start an emulator
3. Click "Run" (green play button)

### 4. Add Widget to Home Screen

Once the app is installed:
1. Long press on your Android home screen
2. Tap "Widgets"
3. Find "Workout Tracker" in the widget list
4. Drag the widget to your home screen

## Widget Functionality

The widget displays:
- **Title**: "Workout Tracker"
- **Completed Count**: Shows "X / Y completed" (e.g., "2 / 5 completed")
- **Remaining Count**: Shows "Z remaining" (e.g., "3 remaining")

The widget automatically updates when you:
- Add a new workout
- Complete/uncomplete a workout
- Delete a workout
- The day changes (automatic daily reset)

Click the widget to open the main app.

## Troubleshooting

### Widget not appearing in widgets list
- Make sure the app is fully installed
- Try restarting your device
- Check that the widget receiver is in AndroidManifest.xml

### Widget not updating
- The widget updates automatically every 30 minutes
- It also updates immediately when you change data in the app
- Try removing and re-adding the widget

### Build errors
- Run `npx expo prebuild --clean` again
- Delete `android/` folder and `node_modules/`, then reinstall and prebuild
- Make sure all dependencies are installed: `npm install`

### Native module not found
- Make sure you ran `npx expo prebuild`
- If using Expo Go, note that custom native modules require a development build
- Use `npx expo run:android` instead of Expo Go

## Development Notes

### Widget Update Mechanism
The widget reads data from AsyncStorage using SharedPreferences:
- **Key**: `RCTAsyncLocalStorage`
- **Data Keys**: `@workouts`, `@daily_completion`

When workout data changes, the app broadcasts an update intent:
```kotlin
Intent(context, WorkoutWidgetProvider::class.java).apply {
    action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
}
```

### File Structure
```
plugins/android-widget/
  ├── index.js                      # Plugin entry point
  ├── withAndroidWidget.js          # AndroidManifest modifier
  └── withMainApplication.js        # MainApplication.kt modifier

android/app/src/main/
  ├── java/com/wtracker/
  │   ├── WorkoutWidgetProvider.kt  # Widget logic
  │   ├── WorkoutWidgetModule.kt    # RN bridge
  │   └── WorkoutWidgetPackage.kt   # Module registration
  └── res/
      ├── xml/
      │   └── workout_widget_info.xml  # Widget metadata
      ├── layout/
      │   └── workout_widget.xml       # Widget UI
      └── values/
          └── strings.xml               # Widget strings
```

## Production Build

For production builds, use EAS Build:
```bash
eas build --platform android
```

Or build locally:
```bash
cd android
./gradlew assembleRelease
```
