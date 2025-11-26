import { View, Text, FlatList, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";
import { useEffect } from "react";

export default function HomeScreen() {
  const { tasks, loadTasks } = useTasks();
  const router = useRouter();
  useEffect(() => {
    console.log("🔵 HomeScreen montado, cargando tareas...");
    loadTasks();
  }, []);
  console.log("📌 Tareas actuales:", tasks);
  
  return (
    <View className="flex-1 bg-white p-5">
      <View className="flex-row justify-between mb-4">
        <Text className="text-2xl font-bold">Mis Tareas</Text>

        <Link
          href="/(home)/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          + Nueva
        </Link>
      </View>

      <FlatList
        data={tasks}
        onRefresh={loadTasks}
        refreshing={false}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => <TaskItem task={item} />}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No tienes tareas aún.
          </Text>
        }
      />
    </View>
  );
}
