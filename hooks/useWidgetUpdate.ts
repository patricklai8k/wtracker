import { NativeModules, Platform } from 'react-native';

const { WorkoutWidget } = NativeModules;

export function useWidgetUpdate() {
  const updateWidget = () => {
    if (Platform.OS === 'android' && WorkoutWidget) {
      try {
        WorkoutWidget.updateWidget();
      } catch (error) {
        console.warn('Failed to update widget:', error);
      }
    }
  };

  return { updateWidget };
}
