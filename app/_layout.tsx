import { Stack } from "expo-router";
import { TasksProvider } from "../context/TaskContext";

export default function RootLayout() {
  return (
    <TasksProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TasksProvider>
  );
}
