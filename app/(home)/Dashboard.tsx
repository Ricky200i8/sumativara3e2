import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";
import { useEffect } from "react";

export default function HomeScreen() {
  const { tasks, loadTasks, isLoading, userEmail } = useTasks();

  // Recargar tareas cuando la pantalla se enfoca
  useEffect(() => {
    console.log("🔵 HomeScreen montado");
    
    if (userEmail) {
      console.log(`👤 Usuario: ${userEmail}`);
      loadTasks();
    } else {
      console.warn("⚠️ Esperando email del usuario...");
    }
  }, [userEmail]); // Solo se ejecuta cuando userEmail cambia

  console.log(`📊 Estado actual - Tareas: ${tasks.length}, Loading: ${isLoading}`);

  // Mostrar indicador de carga
  if (isLoading && tasks.length === 0) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-4">Cargando tareas...</Text>
      </View>
    );
  }

  // Mostrar mensaje si no hay email
  if (!userEmail) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-5">
        <Text className="text-xl font-bold text-gray-700 mb-2">
          No hay sesión activa
        </Text>
        <Text className="text-gray-500 text-center">
          Por favor, inicia sesión para ver tus tareas
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-5">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-2xl font-bold">Mis Tareas</Text>
          <Text className="text-sm text-gray-500 mt-1">{userEmail}</Text>
        </View>

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
        refreshing={isLoading}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => <TaskItem task={item} />}
        ListEmptyComponent={
          <View className="mt-20">
            <Text className="text-center text-gray-500 text-lg mb-2">
              📝 No tienes tareas aún
            </Text>
            <Text className="text-center text-gray-400">
              Presiona "+ Nueva" para crear una
            </Text>
          </View>
        }
        contentContainerStyle={tasks.length === 0 ? { flex: 1 } : undefined}
      />
    </View>
  );
}