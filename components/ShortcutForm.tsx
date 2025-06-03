import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { X, ArrowLeft, Save, Trash2 } from 'lucide-react-native';
import { ShortcutFormData } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface ShortcutFormProps {
  onSubmit: (data: ShortcutFormData) => void;
  onDelete?: () => void;
  initialValues?: Partial<ShortcutFormData>;
  isLoading?: boolean;
  mode: 'add' | 'edit';
}

export const ShortcutForm: React.FC<ShortcutFormProps> = ({
  onSubmit,
  onDelete,
  initialValues = {},
  isLoading = false,
  mode,
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  
  const [name, setName] = useState(initialValues.name || '');
  const [url, setUrl] = useState(initialValues.url || '');
  const [selectedIcon, setSelectedIcon] = useState(initialValues.icon || '0');
  
  const [nameError, setNameError] = useState('');
  const [urlError, setUrlError] = useState('');
  
  // Available icon options
  const iconOptions = [
    { uri: 'https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg' },
    { uri: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg' },
    { uri: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg' },
    { uri: 'https://images.pexels.com/photos/1049622/pexels-photo-1049622.jpeg' },
    { uri: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg' },
    { uri: 'https://images.pexels.com/photos/1762973/pexels-photo-1762973.jpeg' }
  ];

  const handleSubmit = () => {
    // Reset errors
    setNameError('');
    setUrlError('');
    
    // Validate form
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Manga name is required');
      isValid = false;
    }
    
    if (!url.trim()) {
      setUrlError('URL is required');
      isValid = false;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError('URL must start with http:// or https://');
      isValid = false;
    }
    
    if (isValid) {
      onSubmit({
        name: name.trim(),
        url: url.trim(),
        icon: selectedIcon,
      });
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Shortcut',
      `Are you sure you want to delete "${name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: onDelete,
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerLeft}>
          <Pressable 
            style={styles.headerButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={colors.text} />
          </Pressable>
        </View>
        
        <View style={styles.headerTitle}>
          <Text style={[styles.title, { color: colors.text }]}>
            {mode === 'add' ? 'Add New Manga' : 'Edit Manga'}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <Pressable 
            style={styles.headerButton} 
            onPress={() => router.back()}
          >
            <X size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Manga Name</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.card,
                borderColor: nameError ? colors.error : colors.border,
                color: colors.text
              }
            ]}
            placeholder="Enter manga title"
            placeholderTextColor={colors.disabled}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          {nameError ? <Text style={[styles.errorText, { color: colors.error }]}>{nameError}</Text> : null}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Website URL</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.card,
                borderColor: urlError ? colors.error : colors.border,
                color: colors.text
              }
            ]}
            placeholder="https://example.com/manga/title"
            placeholderTextColor={colors.disabled}
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
          />
          {urlError ? <Text style={[styles.errorText, { color: colors.error }]}>{urlError}</Text> : null}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Icon</Text>
          <View style={styles.iconGrid}>
            {iconOptions.map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.iconOption,
                  { 
                    borderColor: selectedIcon === index.toString() ? colors.primary : 'transparent',
                    backgroundColor: colors.card
                  }
                ]}
                onPress={() => setSelectedIcon(index.toString())}
              >
                <Image source={icon} style={styles.iconImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        {mode === 'edit' && onDelete && (
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={handleDeletePress}
            disabled={isLoading}
          >
            <Trash2 size={22} color="#ffffff" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
            isLoading && { opacity: 0.7 }
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Save size={22} color="#ffffff" />
          <Text style={styles.submitButtonText}>
            {mode === 'add' ? 'Add Manga' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  formContainer: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconOption: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.66%',
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
  },
});