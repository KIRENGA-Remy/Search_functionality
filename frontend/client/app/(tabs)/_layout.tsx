import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout(){
  return(
    <Tabs
    screenOptions={{ tabBarActiveTintColor: '3b82f6'}}
    >
      <Tabs.Screen 
      name="home"
      options={{
        title: 'Home',
        tabBarIcon: ({ color }) => (
          <Ionicons name="home" size={24} color={color} />
        )
      }}
      />
      <Tabs.Screen 
      name="profile"
      options={{
        title: 'Profile',
        tabBarIcon: ({ color }) => (
          <Ionicons name="person" size={24} color={color} />
        )
      }}
      />
      <Tabs.Screen 
      name="search"
      options={{
        title: 'Search',
        tabBarIcon: ({ color}) => (
          <Ionicons size={24} name="search" color={color} />
        )
      }}
      />
    </Tabs>
  )
}