import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { ShortcutType } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface ShortcutIconProps {
  shortcut: ShortcutType;
  onPress: () => void;
  onLongPress: () => void;
  disabled?: boolean;
}

export const ShortcutIcon: React.FC<ShortcutIconProps> = ({
  shortcut,
  onPress,
  onLongPress,
  disabled = false,
}) => {
  const { colors } = useTheme();
  
  const iconSources = [
    'https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg',
    'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
    'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg',
    'https://images.pexels.com/photos/1049622/pexels-photo-1049622.jpeg',
    'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg',
    'https://images.pexels.com/photos/1762973/pexels-photo-1762973.jpeg'
  ];
  
  // Get the icon based on the index stored (or default to first)
  const iconIndex = parseInt(shortcut.icon || '0', 10);
  const iconSource = { uri: iconSources[iconIndex] || iconSources[0] };
  
  // Determine if there's an error status
  const hasError = shortcut.status?.hasError === true;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { 
          opacity: (pressed || disabled) ? 0.7 : 1,
          backgroundColor: colors.card, 
        }
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        <Image source={iconSource} style={styles.icon} />
        
        {hasError && (
          <View style={[styles.statusBadge, { backgroundColor: colors.error }]}>
            <AlertTriangle size={14} color="#ffffff" />
          </View>
        )}
        
        {disabled && !hasError && (
          <View style={[styles.disabledOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
        )}
      </View>
      
      <Text 
        style={[styles.label, { color: colors.text }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {shortcut.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    margin: '1.66%',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 8,
    aspectRatio: 0.9,
  },
  iconContainer: {
    position: 'relative',
    width: '100%',
    height: '75%',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});