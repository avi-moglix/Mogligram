// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (10 digits)
export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Email or Phone validation
export const validateEmailOrPhone = (value) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: 'Email or phone is required' };
  }
  
  const trimmedValue = value.trim();
  
  // Check if it's a phone number (contains only digits)
  if (/^\d+$/.test(trimmedValue)) {
    if (validatePhone(trimmedValue)) {
      return { isValid: true, type: 'phone', value: trimmedValue };
    } else {
      return { isValid: false, error: 'Phone number must be exactly 10 digits' };
    }
  }
  
  // Otherwise treat as email
  if (validateEmail(trimmedValue)) {
    return { isValid: true, type: 'email', value: trimmedValue };
  } else {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
};

// Password validation (8+ chars, 1 uppercase, 1 number, 1 special char)
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase) {
    return { isValid: false, error: 'Password must contain at least 1 uppercase letter' };
  }
  
  if (!hasNumber) {
    return { isValid: false, error: 'Password must contain at least 1 number' };
  }
  
  if (!hasSpecialChar) {
    return { isValid: false, error: 'Password must contain at least 1 special character' };
  }
  
  return { isValid: true };
};

// Generate unique ID
export const generateUniqueId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get initials from email or phone
export const getInitials = (value) => {
  if (!value) return '?';
  
  // If phone number, return first digit
  if (/^\d+$/.test(value)) {
    return value[0];
  }
  
  // If email, return first letter
  return value[0].toUpperCase();
};
