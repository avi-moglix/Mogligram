import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Bar as ProgressBar } from 'react-native-progress';
import Input from '@atom-design-mog/input';
import DatePicker from '@atom-design-mog/datepicker';
import Dropdown from '@atom-design-mog/dropdown';
import AButton from '@atom-design-mog/buttons';
import { logout } from '../redux/authSlice';
import { updateProfileField, clearProfile } from '../redux/userSlice';
import { clearAllData, saveUserProfile } from '../utils/storage';
import { getInitials } from '../utils/validation';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, profileProgress } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    age: profile.age || '',
    dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
    location: profile.location || '',
    phone: profile.phone || '',
    company: profile.company || '',
    website: profile.website || '',
    interests: profile.interests || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      name: profile.name || '',
      bio: profile.bio || '',
      age: profile.age || '',
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
      location: profile.location || '',
      phone: profile.phone || '',
      company: profile.company || '',
      website: profile.website || '',
      interests: profile.interests || '',
    });
    setHasUnsavedChanges(false);
    setIsEditing(false);
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form data to original profile values
    setFormData({
      name: profile.name || '',
      bio: profile.bio || '',
      age: profile.age || '',
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
      location: profile.location || '',
      phone: profile.phone || '',
      company: profile.company || '',
      website: profile.website || '',
      interests: profile.interests || '',
    });
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // Convert Date objects to ISO string for storage
      const processedData = { ...formData };
      if (processedData.dateOfBirth instanceof Date) {
        processedData.dateOfBirth = processedData.dateOfBirth.toISOString();
      }
      
      // Update Redux with all fields
      Object.entries(processedData).forEach(([field, value]) => {
        dispatch(updateProfileField({ field, value }));
      });
      
      // Update AsyncStorage
      await saveUserProfile(processedData);
      
      setHasUnsavedChanges(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            dispatch(logout());
            dispatch(clearProfile());
          },
        },
      ],
      { cancelable: true }
    );
  };

  const companyOptions = [
    { label: 'Moglix', value: 'Moglix' },
    { label: 'Credlix', value: 'Credlix' },
    { label: 'Zoglix', value: 'Zoglix' },
    { label: 'Cognilix', value: 'Cognilix' },
    { label: 'Mogligram', value: 'Mogligram' },
  ];

  const renderDropdownField = (field, label) => {
    return (
      <View style={styles.fieldItem} key={field} pointerEvents={!isEditing ? "none" : "auto"}>
        <Dropdown
          label={label}
          placeholder="Select a company"
          triggerText={formData[field] || 'Tap to choose'}
          options={companyOptions}
          onSelect={(value) => handleFieldChange(field, value)}
          disabled={!isEditing}
        />
      </View>
    );
  };

  const renderDateField = () => {
    const field = 'dateOfBirth';

    return (
      <View style={styles.fieldItem} key={field}>
        <DatePicker
          type="date"
          label="Date of Birth"
          placeholder="Select your birth date"
          value={formData[field]}
          onChange={(date) => handleFieldChange(field, date)}
          disabled={!isEditing}
        />
      </View>
    );
  };

  const renderField = (field, label, placeholder, keyboardType = 'default', multiline = false) => {
    return (
      <View style={styles.fieldItem} key={field}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Input
          type="text"
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(value) => handleFieldChange(field, value)}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          editable={isEditing}
          disabled={!isEditing}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {getInitials(user?.identifier || '')}
            </Text>
          </View>
          <Text style={styles.userIdentifier}>{user?.identifier || 'User'}</Text>
          <Text style={styles.userId}>ID: {user?.id || 'N/A'}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Profile Completion</Text>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={profileProgress / 100}
              width={null}
              height={12}
              color="#d9232d"
              unfilledColor="#e0e0e0"
              borderWidth={0}
              borderRadius={6}
            />
          </View>
          <Text style={styles.progressText}>{profileProgress}% Complete</Text>
          <Text style={styles.progressHint}>
            Fill in all fields to complete your profile
          </Text>
        {/* Action Buttons */}
        {!isEditing ? (
          <View style={styles.saveSection}>
            <AButton
              title="Edit Profile"
              onPress={handleEdit}
              color="#d9232d"
              size="medium"
              variant="text"
            />
          </View>
        ) : (
          <View style={styles.editActionsSection}>
            <View style={styles.editButton}>
              <AButton
                title="Cancel"
                onPress={handleCancel}
                color="#666"
                size="medium"
                variant="text"
              />
            </View>
            <View style={styles.editButton}>
              <AButton
                title={isSaving ? 'Saving...' : 'Save Changes'}
                onPress={handleSaveProfile}
                // disabled={!hasUnsavedChanges || isSaving}
                // color={!hasUnsavedChanges || isSaving ? 'disabledText' : '#d9232d'}
                color="#d9232d"
                size="medium"
                variant="text"
              />
            </View>
          </View>
        )}
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.sectionCard}>
            {renderField('name', 'Full Name', 'Enter your full name')}
            {renderField('bio', 'Bio', 'Tell us about yourself', 'default', true)}
            {renderField('age', 'Age', 'Enter your age', 'numeric')}
            {renderDateField()}
            {renderField('phone', 'Phone Number', 'Enter your phone number', 'phone-pad')}
            {renderField('location', 'Location', 'Enter your city/country')}
          </View>
          
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.sectionCard}>
            {renderDropdownField('company', 'Company')}
            {renderField('website', 'Website', 'Enter your website URL', 'url')}
            {renderField('interests', 'Interests', 'Enter your interests (comma separated)', 'default', true)}
          </View>
        </View>
        
        {/* Action Buttons */}
        {!isEditing ? (
          <View style={styles.saveSection}>
            <AButton
              title="Edit Profile"
              onPress={handleEdit}
              color="#d9232d"
              size="medium"
              variant="text"
            />
          </View>
        ) : (
          <View style={styles.editActionsSection}>
            <View style={styles.editButton}>
              <AButton
                title="Cancel"
                onPress={handleCancel}
                color="#666"
                size="medium"
                variant="text"
              />
            </View>
            <View style={styles.editButton}>
              <AButton
                title={isSaving ? 'Saving...' : 'Save Changes'}
                onPress={handleSaveProfile}
                // disabled={!hasUnsavedChanges || isSaving}
                // color={!hasUnsavedChanges || isSaving ? 'disabledText' : '#d9232d'}
                color="#d9232d"
                size="medium"
                variant="text"
              />
            </View>
          </View>
        )}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <AButton
            title="Logout"
            onPress={handleLogout}
            color="#d9232d"
            size="large"
            variant="solid"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d9232d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  userIdentifier: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    color: '#999',
  },
  progressSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d9232d',
    marginBottom: 4,
  },
  progressHint: {
    fontSize: 12,
    color: '#999',
  },
  fieldsSection: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fieldItem: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  saveSection: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  editActionsSection: {
    marginTop: 24,
    marginHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  logoutSection: {
    marginTop: 16,
    marginHorizontal: 16,
  },
});

export default ProfileScreen;
