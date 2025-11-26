import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostDetailScreen from '../screens/PostDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab icon component
const TabIcon = ({ focused, label }) => (
  <View style={styles.tabIconContainer}>
    <View style={[styles.tabIconDot, focused && styles.tabIconDotActive]} />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label}
    </Text>
  </View>
);

// Bottom Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#d9232d',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Home" />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label="Profile" />,
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator (includes tabs and post detail)
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconDot: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginBottom: 4,
  },
  tabIconDotActive: {
    backgroundColor: '#d9232d',
    width: 18,
    height: 8,
    borderRadius: 4,
  },
  tabLabel: {
    fontSize: 12,
    width: 40,
    fontWeight: '500',
    color: '#666',
  },
  tabLabelActive: {
    color: '#d9232d',
    fontWeight: '600',
  },
});

export default MainNavigator;
