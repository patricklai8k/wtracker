import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    background: '#f5f5f5',
    card: '#fff',
    text: '#333',
    textSecondary: '#666',
    textTertiary: '#999',
    border: '#e0e0e0',
    primary: '#2196F3',
    success: '#4CAF50',
    successLight: '#f0f8f0',
    iconBackground: '#e3f2fd',
    iconBorder: '#2196F3',
    placeholder: '#fafafa',
    tabBackground: '#f0f0f0',
    inputBackground: '#fff',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textTertiary: '#808080',
    border: '#333333',
    primary: '#64b5f6',
    success: '#81c784',
    successLight: '#1a3a1a',
    iconBackground: '#1a3a5a',
    iconBorder: '#64b5f6',
    placeholder: '#2a2a2a',
    tabBackground: '#2a2a2a',
    inputBackground: '#2a2a2a',
  },
};

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    colors: isDark ? colors.dark : colors.light,
    isDark,
  };
}
