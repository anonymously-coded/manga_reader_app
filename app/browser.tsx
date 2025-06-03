import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Pressable, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import WebView from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, X, RefreshCw, Share2 } from 'lucide-react-native';
import { useShortcuts } from '@/hooks/useShortcuts';
import { adBlockScript } from '@/utils/adBlocker';
import { useTheme } from '@/context/ThemeContext';
import { Platform } from 'react-native';

export default function BrowserScreen() {
  const { url, name } = useLocalSearchParams<{ url: string, name: string }>();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url || '');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { updateShortcutStatusByUrl } = useShortcuts();
  const { colors } = useTheme();

  // Handle missing URL
  useEffect(() => {
    if (!url) {
      router.replace('/');
    }
  }, [url]);

  // Update shortcut status based on page load
  const handleLoad = (event: any) => {
    setLoading(false);
    setError(null);
    
    const loadedUrl = event.nativeEvent.url;
    setCurrentUrl(loadedUrl);
    
    // Check if the URL is the same as the original
    if (loadedUrl && url) {
      updateShortcutStatusByUrl(url, {
        lastChecked: new Date().toISOString(),
        hasNextPage: true,
        hasError: false,
      });
    }
  };

  // Handle errors
  const handleError = (event: any) => {
    setLoading(false);
    setError('Failed to load page');
    
    if (url) {
      updateShortcutStatusByUrl(url, {
        lastChecked: new Date().toISOString(),
        hasNextPage: false,
        hasError: true,
      });
    }
  };

  // Handle the share action
  const handleShare = async () => {
    if (Platform.OS === 'web') {
      // Web sharing API
      try {
        await navigator.share({
          title: name || 'Shared manga',
          url: currentUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Native sharing would be implemented here
      alert('Sharing is not implemented for this platform yet');
    }
  };

  if (!url) {
    return null; // Will redirect in useEffect
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text 
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name || 'Browser'}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <Pressable 
            style={styles.headerButton} 
            onPress={() => webViewRef.current?.reload()}
          >
            <RefreshCw size={20} color={colors.text} />
          </Pressable>
          
          <Pressable 
            style={styles.headerButton} 
            onPress={handleShare}
          >
            <Share2 size={20} color={colors.text} />
          </Pressable>
          
          <Pressable 
            style={styles.headerButton} 
            onPress={() => router.back()}
          >
            <X size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>
      
      <View style={styles.webViewContainer}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
            <Pressable 
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setError(null);
                setLoading(true);
                webViewRef.current?.reload();
              }}
            >
              <Text style={[styles.retryButtonText, { color: colors.background }]}>
                Retry
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <WebView
              ref={webViewRef}
              source={{ uri: url }}
              style={styles.webView}
              onLoad={handleLoad}
              onError={handleError}
              onHttpError={handleError}
              injectedJavaScript={adBlockScript}
              pullToRefreshEnabled
            />
            
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
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
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});