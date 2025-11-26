# Mogligram 📱

**Connect • Share • Inspire**

A full-featured social media React Native application with authentication, posts feed, user profiles, and more!

---

## 🌟 Features

### 🔐 Authentication
- Secure login with email or phone number
- Password validation (8+ chars, uppercase, number, special character)
- Real-time form validation
- Persistent sessions with AsyncStorage
- Auto-login on app restart

### 🏠 Posts Feed
- Beautiful card-based posts from API
- Pull-to-refresh functionality
- Smooth scrolling through 100+ posts
- Tap any post to view details
- User avatars and metadata
- Loading skeletons for better UX

### 👤 User Profile
- Complete profile dashboard
- Progress bar showing completion (0-100%)
- 8 editable fields (Name, Bio, Age, Phone, Location, Company, Website, Interests)
- Individual save buttons with feedback
- Data persistence across sessions

### 📝 Post Details
- Full post content view
- Comments section with user info
- Beautiful UI with cards

---

## 🚀 Quick Start

### Installation

Dependencies are already installed! Just run:

```bash
# Android
npm run android

# iOS (after: cd ios && pod install && cd ..)
npm run ios
```

---

## 🔑 Test Login

**Option 1 - Email:**
```
Email: test@mogligram.com
Password: Test@1234
```

**Option 2 - Phone:**
```
Phone: 1234567890
Password: Mogligram@123
```

### Password Requirements:
- ✓ Minimum 8 characters
- ✓ At least 1 uppercase letter
- ✓ At least 1 number
- ✓ At least 1 special character

---

## 📂 Project Structure

```
Mogligram/
├── app/
│   ├── components/        # UI components
│   ├── navigation/        # Navigation config
│   ├── redux/            # State management
│   ├── screens/          # All screens
│   ├── utils/            # Helpers (API, storage, validation)
│   └── App.js            # Root component
├── android/              # Android native
├── ios/                  # iOS native
└── index.js              # Entry point
```

---

## 🛠️ Tech Stack

- React Native 0.82.1
- React Navigation (Stack + Tabs)
- Redux Toolkit
- AsyncStorage
- Axios
- JSONPlaceholder API
- react-native-progress

---

## 📱 App Flow

```
Launch → Splash → Check Auth
  ├─ Not Logged In → Login Screen
  └─ Logged In → Home (Posts Feed)
      ├─ Tap Post → Post Detail
      ├─ Profile Tab → Edit Profile
      └─ Logout → Back to Login
```

---

## 🎯 Key Features

✅ Real-time validation  
✅ Persistent login  
✅ Profile progress tracking  
✅ Pull-to-refresh  
✅ Skeleton loaders  
✅ Error handling  
✅ Toast notifications  
✅ Smooth animations  

---

## 🧪 Quick Test

1. Launch app → See splash screen
2. Login with: `test@mogligram.com` / `Test@1234`
3. View posts → Pull to refresh
4. Tap any post → View details
5. Go to Profile → Fill fields → See progress increase
6. Close & reopen app → Still logged in ✅
7. Logout → Data cleared ✅

---

## 🔧 Troubleshooting

**Clear Cache:**
```bash
npm start --reset-cache
```

**Clean Android:**
```bash
cd android && ./gradlew clean && cd ..
```

**Reinstall iOS Pods:**
```bash
cd ios && pod install && cd ..
```

---

## 📝 API

Uses **JSONPlaceholder** for demo data:
- GET /posts
- GET /posts/:id
- GET /posts/:id/comments

---

## 🚧 Future Ideas

- Create posts
- Like/comment
- Image upload
- Dark mode
- Search & filter
- Direct messaging
- Push notifications

---

## 📄 License

MIT

---

**Mogligram** - Connect • Share • Inspire 🚀

Built with ❤️ using React Native
