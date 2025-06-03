import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShortcuts } from '@/hooks/useShortcuts';
import { ShortcutForm } from '@/components/ShortcutForm';
import { ShortcutFormData, ShortcutType } from '@/types';
import { useTheme } from '@/context/ThemeContext';

export default function EditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { shortcuts, updateShortcut, removeShortcut } = useShortcuts();
  const [shortcut, setShortcut] = useState<ShortcutType | null>(null);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (id) {
      const foundShortcut = shortcuts.find(s => s.id === id);
      if (foundShortcut) {
        setShortcut(foundShortcut);
      } else {
        // Shortcut not found, navigate back
        router.back();
      }
    }
  }, [id, shortcuts]);

  const handleSubmit = async (data: ShortcutFormData) => {
    if (!shortcut) return;
    
    setLoading(true);
    
    try {
      const updatedShortcut = {
        ...shortcut,
        name: data.name,
        url: data.url,
        icon: data.icon,
      };
      
      await updateShortcut(updatedShortcut);
      router.push('/');
    } catch (error) {
      console.error('Error updating shortcut:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!shortcut) return;
    
    setLoading(true);
    
    try {
      await removeShortcut(shortcut.id);
      router.push('/');
    } catch (error) {
      console.error('Error deleting shortcut:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!shortcut) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ShortcutForm 
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            initialValues={{
              name: shortcut.name,
              url: shortcut.url,
              icon: shortcut.icon,
            }}
            isLoading={loading}
            mode="edit"
          />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});