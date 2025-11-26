import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';

import Input from '@atom-design-mog/input';
import AButton from '@atom-design-mog/buttons';

import { login } from '../redux/authSlice';
import { saveAuthData } from '../utils/storage';
import { validateEmailOrPhone, validatePassword, generateUniqueId } from '../utils/validation';


const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate email/phone in real-time
  const handleEmailPhoneChange = (value) => {
    setEmailOrPhone(value);
    if (value.trim()) {
      const validation = validateEmailOrPhone(value);
      setEmailError(validation.isValid ? '' : validation.error);
    } else {
      setEmailError('');
    }
  };

  // Validate password in real-time
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value) {
      const validation = validatePassword(value);
      setPasswordError(validation.isValid ? '' : validation.error);
    } else {
      setPasswordError('');
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const emailValidation = validateEmailOrPhone(emailOrPhone);
    const passwordValidation = validatePassword(password);
    return emailValidation.isValid && passwordValidation.isValid;
  };

  // Handle login
  const handleLogin = async () => {
    setLoading(true);

    // Final validation
    const emailValidation = validateEmailOrPhone(emailOrPhone);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      setLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error);
      setLoading(false);
      return;
    }

    // Simulate login delay
    setTimeout(async () => {
      const userId = generateUniqueId();
      const token = `token_${Date.now()}`;

      const authData = {
        isAuthenticated: true,
        user: {
          id: userId,
          identifier: emailValidation.value,
          type: emailValidation.type,
        },
        token,
      };

      // Save to Redux
      dispatch(login(authData));

      // Save to AsyncStorage
      await saveAuthData(authData);

      setLoading(false);
      // Navigation will be handled by App.js auth check
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logo}>Mogligram</Text>
              <Text style={styles.subtitle}>Welcome Back Mogli !</Text>
              <Text style={styles.description}>Connect • Share • Inspire</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email or Phone Number</Text>
                <Input
                  type="text"
                  placeholder="Enter email or 10-digit phone"
                  value={emailOrPhone}
                  onChangeText={handleEmailPhoneChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <Input
                  type="text"
                  placeholder="Enter password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                />
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
                {!passwordError && password ? (
                  <Text style={styles.hintText}>
                    8+ chars, 1 uppercase, 1 number, 1 special character
                  </Text>
                ) : null}
              </View>

              <AButton
                title={loading ? 'Signing in...' : 'Login'}
                onPress={handleLogin}
                disabled={!isFormValid() || loading}
                color="primary"
                size="large"
                variant="solid"
              />

              {loading && (
                <ActivityIndicator
                  size="large"
                  color="#d9232d"
                  style={styles.loader}
                />
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.linkText}>Sign Up</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#d9232d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#d9232d',
    marginTop: 4,
  },
  hintText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  loader: {
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    color: '#d9232d',
    fontWeight: '600',
  },
});

export default LoginScreen;