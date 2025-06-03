import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Trash2, Moon, Sun, ShieldCheck, Info } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useShortcuts } from '@/hooks/useShortcuts';
import { SettingsItem } from '@/components/SettingsItem';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { clearAllShortcuts } = useShortcuts();
  const { colors } = useTheme();
  
  const isDarkMode = theme === 'dark';

  const confirmClearAll = () => {
    Alert.alert(
      'Clear All Shortcuts',
      'Are you sure you want to remove all your manga shortcuts? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          onPress: clearAllShortcuts,
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        </View>
        
        <SettingsItem
          icon={isDarkMode ? <Moon size={22} color={colors.primary} /> : <Sun size={22} color={colors.primary} />}
          title="Dark Mode"
          rightElement={
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          }
        />
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Content</Text>
        </View>
        
        <SettingsItem
          icon={<ShieldCheck size={22} color={colors.primary} />}
          title="Ad Blocker"
          subtitle="Block ads when browsing manga sites"
          rightElement={
            <Switch
              value={true}
              // This is always on for now, but could be made configurable
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          }
        />
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data</Text>
        </View>
        
        <Pressable onPress={confirmClearAll}>
          <SettingsItem
            icon={<Trash2 size={22} color={colors.error} />}
            title="Clear All Shortcuts"
            subtitle="Remove all manga from your library"
            isDestructive
          />
        </Pressable>
      </View>
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        </View>
        
        <SettingsItem
          icon={<Info size={22} color={colors.primary} />}
          title="Version"
          subtitle="1.0.0"
        />
      </View>
      
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.7,
  },
});