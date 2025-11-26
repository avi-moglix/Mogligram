import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH: '@app_auth',
  USER_PROFILE: '@app_user_profile',
};

// Auth Storage
export const saveAuthData = async (authData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
    return true;
  } catch (error) {
    console.error('Error saving auth data:', error);
    return false;
  }
};

export const getAuthData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting auth data:', error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

// User Profile Storage
export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};

export const getUserProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const clearUserProfile = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    return true;
  } catch (error) {
    console.error('Error clearing user profile:', error);
    return false;
  }
};

// Clear All Data
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH, STORAGE_KEYS.USER_PROFILE]);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};
