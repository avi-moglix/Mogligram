import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    name: '',
    bio: '',
    age: '',
    dateOfBirth: '',
    location: '',
    phone: '',
    company: '',
    website: '',
    interests: '',
  },
  profileProgress: 0,
};

const calculateProgress = (profile) => {
  const fields = Object.values(profile);
  const filledFields = fields.filter(field => field && field.trim() !== '');
  return Math.round((filledFields.length / fields.length) * 100);
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.profileProgress = calculateProgress(state.profile);
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state.profile[field] = value;
      state.profileProgress = calculateProgress(state.profile);
    },
    clearProfile: (state) => {
      state.profile = initialState.profile;
      state.profileProgress = 0;
    },
    hydrateProfile: (state, action) => {
      state.profile = action.payload.profile;
      state.profileProgress = calculateProgress(action.payload.profile);
    },
  },
});

export const { updateProfile, updateProfileField, clearProfile, hydrateProfile } = userSlice.actions;
export default userSlice.reducer;
