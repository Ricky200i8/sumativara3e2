import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Pantallas ocultas en la barra de pestañas */}
      <Tabs.Screen
        name="tasks/create"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tasks/edit/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
