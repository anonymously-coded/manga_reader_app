import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Color palettes
const darkColors = {
  primary: '#a78bfa',     // Purple
  secondary: '#5eead4',   // Teal
  accent: '#fb923c',      // Orange
  success: '#4ade80',     // Green
  warning: '#fbbf24',     // Yellow
  error: '#f87171',       // Red
  background: '#121212',  // Dark Background
  card: '#1e1e1e',        // Slightly lighter dark
  text: '#f3f4f6',        // Almost white
  border: '#2d2d2d',      // Dark gray
  notification: '#f87171',// Red notification
  disabled: '#6b7280',    // Gray
};

const lightColors = {
  primary: '#8b5cf6',     // Purple
  secondary: '#14b8a6',   // Teal
  accent: '#f97316',      // Orange
  success: '#22c55e',     // Green
  warning: '#f59e0b',     // Yellow
  error: '#ef4444',       // Red
  background: '#f9fafb',  // Light background
  card: '#ffffff',        // White
  text: '#1f2937',        // Almost black
  border: '#e5e7eb',      // Light gray
  notification: '#ef4444',// Red notification
  disabled: '#9ca3af',    // Gray
};

type ThemeType = 'light' | 'dark';

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof darkColors;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  colors: darkColors,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme() as ThemeType;
  const [theme, setTheme] = useState<ThemeType>('dark'); // Default to dark
  const [loaded, setLoaded] = useState(false);

  // Load theme preference from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        } else {
          // If no saved preference, use system preference
          setTheme(systemTheme || 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem('theme', theme).catch(error => {
        console.error('Failed to save theme preference:', error);
      });
    }
  }, [theme, loaded]);

  const toggleTheme = () => {
    setTheme(current => (current === 'dark' ? 'light' : 'dark'));
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);