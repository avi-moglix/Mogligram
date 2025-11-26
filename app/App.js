import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './redux/store';
import { hydrateAuth } from './redux/authSlice';
import { hydrateProfile } from './redux/userSlice';
import { getAuthData, getUserProfile } from './utils/storage';
import { StatusBar } from 'react-native';
import { DefaultTheme, DarkTheme, useTheme } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import MainNavigator from './navigation/MainNavigator';

// App Content Component
const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check AsyncStorage for saved auth data
      const authData = await getAuthData();
      const userProfile = await getUserProfile();

      if (authData && authData.isAuthenticated) {
        // Hydrate Redux with saved data
        dispatch(hydrateAuth(authData));
        
        if (userProfile) {
          dispatch(hydrateProfile({ profile: userProfile }));
        }
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      // Small delay for splash effect
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashLogo}>Mogligram</Text>
        <Text style={styles.splashTagline}>Connect • Share • Inspire</Text>
        <ActivityIndicator size="large" color="#d9232d" style={styles.splashLoader} />
        <Text style={styles.splashText}>Loading...</Text>
      </View>
    );
  }

  return (
  <NavigationContainer>
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="dark-content"
    />

    {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
  </NavigationContainer>
);

};

// Root App Component
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  splashLogo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#d9232d',
    marginBottom: 8,
  },
  splashTagline: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  splashLoader: {
    marginBottom: 12,
  },
  splashText: {
    fontSize: 16,
    color: '#666',
  },
});
