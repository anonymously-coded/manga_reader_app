import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShortcutType, ShortcutStatus } from '@/types';

const SHORTCUTS_STORAGE_KEY = 'manga_shortcuts';

export const useShortcuts = () => {
  const [shortcuts, setShortcuts] = useState<ShortcutType[]>([]);
  const [loading, setLoading] = useState(true);

  // Load shortcuts from storage
  const loadShortcuts = useCallback(async () => {
    try {
      setLoading(true);
      const storedShortcuts = await AsyncStorage.getItem(SHORTCUTS_STORAGE_KEY);
      
      if (storedShortcuts) {
        setShortcuts(JSON.parse(storedShortcuts));
      }
    } catch (error) {
      console.error('Failed to load shortcuts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save shortcuts to storage
  const saveShortcuts = useCallback(async (shortcuts: ShortcutType[]) => {
    try {
      await AsyncStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts));
    } catch (error) {
      console.error('Failed to save shortcuts:', error);
    }
  }, []);

  // Initialize by loading shortcuts
  useEffect(() => {
    loadShortcuts();
  }, []);

  // Add a new shortcut
  const addShortcut = useCallback(async (shortcut: ShortcutType) => {
    const updatedShortcuts = [...shortcuts, shortcut];
    setShortcuts(updatedShortcuts);
    await saveShortcuts(updatedShortcuts);
    return shortcut;
  }, [shortcuts, saveShortcuts]);

  // Update an existing shortcut
  const updateShortcut = useCallback(async (updatedShortcut: ShortcutType) => {
    const updatedShortcuts = shortcuts.map((shortcut) =>
      shortcut.id === updatedShortcut.id ? updatedShortcut : shortcut
    );
    
    setShortcuts(updatedShortcuts);
    await saveShortcuts(updatedShortcuts);
    return updatedShortcut;
  }, [shortcuts, saveShortcuts]);

  // Remove a shortcut
  const removeShortcut = useCallback(async (id: string) => {
    const updatedShortcuts = shortcuts.filter((shortcut) => shortcut.id !== id);
    setShortcuts(updatedShortcuts);
    await saveShortcuts(updatedShortcuts);
  }, [shortcuts, saveShortcuts]);

  // Clear all shortcuts
  const clearAllShortcuts = useCallback(async () => {
    setShortcuts([]);
    await saveShortcuts([]);
  }, [saveShortcuts]);

  // Update shortcut status
  const updateShortcutStatus = useCallback(async (id: string, status: ShortcutStatus) => {
    const updatedShortcuts = shortcuts.map((shortcut) => {
      if (shortcut.id === id) {
        return {
          ...shortcut,
          status,
        };
      }
      return shortcut;
    });
    
    setShortcuts(updatedShortcuts);
    await saveShortcuts(updatedShortcuts);
  }, [shortcuts, saveShortcuts]);

  // Update shortcut status by URL
  const updateShortcutStatusByUrl = useCallback(async (url: string, status: ShortcutStatus) => {
    const updatedShortcuts = shortcuts.map((shortcut) => {
      if (shortcut.url === url) {
        return {
          ...shortcut,
          status,
        };
      }
      return shortcut;
    });
    
    setShortcuts(updatedShortcuts);
    await saveShortcuts(updatedShortcuts);
  }, [shortcuts, saveShortcuts]);

  return {
    shortcuts,
    loading,
    addShortcut,
    updateShortcut,
    removeShortcut,
    updateShortcutStatus,
    updateShortcutStatusByUrl,
    clearAllShortcuts,
    refreshShortcuts: loadShortcuts,
  };
};