import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'none',
        lazy: false,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 76,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: '#F7F7F5',
          borderTopWidth: 0,
          borderTopLeftRadius: 34,
          borderTopRightRadius: 34,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          elevation: 10,
          shadowColor: '#D9CDBD',
          shadowOpacity: 0.18,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarActiveTintColor: '#B14F0A',
        tabBarInactiveTintColor: '#9CAAC0',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          textTransform: 'uppercase',
          letterSpacing: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 1,
        },
        tabBarBackground: () => <View className="flex-1 rounded-t-[34px] bg-[#F7F7F5]" />,
      }}
    >
      <Tabs.Screen
        name="playbook"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'home' : 'home-outline'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="situations"
        options={{
          title: 'Situations',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'list' : 'list-outline'} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="drills"
        options={{
          title: 'Drills',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'baseball' : 'baseball-outline'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'settings' : 'settings-outline'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="drills/category/[slug]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="situations/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="drills/detail/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
