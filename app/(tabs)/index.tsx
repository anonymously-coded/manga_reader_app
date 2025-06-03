import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleAlert as AlertCircle, RefreshCcw } from 'lucide-react-native';
import { useShortcuts } from '@/hooks/useShortcuts';
import { checkWebsiteStatus } from '@/utils/statusChecker';
import { ShortcutIcon } from '@/components/ShortcutIcon';
import { useTheme } from '@/context/ThemeContext';
import { EmptyState } from '@/components/EmptyState';
import { ShortcutType } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { shortcuts, removeShortcut, updateShortcutStatus } = useShortcuts();
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const checkAllStatuses = async () => {
    setRefreshing(true);
    
    try {
      for (const shortcut of shortcuts) {
        const status = await checkWebsiteStatus(shortcut.url);
        updateShortcutStatus(shortcut.id, status);
      }
    } catch (error) {
      console.error('Error checking statuses:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (shortcuts.length > 0) {
      checkAllStatuses();
    }
  }, [shortcuts.length]);

  const handleShortcutPress = (shortcut: ShortcutType) => {
    if (shortcut.status?.hasNextPage !== false) {
      router.push({
        pathname: '/browser',
        params: { url: shortcut.url, name: shortcut.name }
      });
    }
  };

  const handleShortcutLongPress = (shortcut: ShortcutType) => {
    router.push({
      pathname: '/edit',
      params: { id: shortcut.id }
    });
  };

  const renderItem = ({ item }: { item: ShortcutType }) => (
    <ShortcutIcon
      shortcut={item}
      onPress={() => handleShortcutPress(item)}
      onLongPress={() => handleShortcutLongPress(item)}
      disabled={item.status?.hasNextPage === false}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Manga Library</Text>
        <Pressable 
          style={[styles.refreshButton, { backgroundColor: colors.card }]}
          onPress={checkAllStatuses}
          disabled={refreshing}
        >
          <RefreshCcw 
            size={20} 
            color={refreshing ? colors.disabled : colors.primary} 
          />
        </Pressable>
      </View>
      
      {shortcuts.length > 0 ? (
        <FlatList
          data={shortcuts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          onRefresh={checkAllStatuses}
          refreshing={refreshing}
        />
      ) : (
        <EmptyState
          icon={<AlertCircle size={50} color={colors.primary} />}
          title="No Manga Added"
          description="Add your first manga by tapping the '+' button below"
        />
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
  },
  gridContainer: {
    padding: 16,
  },
});