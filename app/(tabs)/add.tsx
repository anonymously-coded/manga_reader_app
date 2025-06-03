import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShortcuts } from '@/hooks/useShortcuts';
import { ShortcutForm } from '@/components/ShortcutForm';
import { ShortcutFormData } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { generateRandomId } from '@/utils/helpers';

export default function AddScreen() {
  const router = useRouter();
  const { addShortcut } = useShortcuts();
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  
  const handleSubmit = async (data: ShortcutFormData) => {
    setLoading(true);
    
    try {
      const newShortcut = {
        id: generateRandomId(),
        name: data.name,
        url: data.url,
        icon: data.icon,
        createdAt: new Date().toISOString(),
        status: {
          lastChecked: new Date().toISOString(),
          hasNextPage: true,
          hasError: false,
        }
      };
      
      await addShortcut(newShortcut);
      router.push('/');
    } catch (error) {
      console.error('Error adding shortcut:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <ShortcutForm 
            onSubmit={handleSubmit} 
            isLoading={loading} 
            mode="add"
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
});