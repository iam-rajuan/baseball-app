import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 12,
        },
        tabBarActiveTintColor: '#F46A12',
        tabBarInactiveTintColor: '#9AA5BC',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="playbook"
        options={{
          title: 'Playbook',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="book-outline" size={size} />,
        }}
      />
      <Tabs.Screen
        name="drills"
        options={{
          title: 'Drills',
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="baseball-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="stats-chart-outline" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons color={color} name="person-outline" size={size} />,
        }}
      />
    </Tabs>
  );
}
