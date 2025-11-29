import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Pressable,
  SafeAreaView 
} from "react-native";
import { Link } from "expo-router";
import { useTasks } from "@/context/TaskContext";
import TaskItem from "@/components/TaskItem";
import { useEffect } from "react";
import { Plus, Loader, ClipboardList, LogIn } from "lucide-react-native";

export default function HomeScreen() {
  const { tasks, loadTasks, isLoading, userEmail } = useTasks();

  useEffect(() => {
    console.log("HomeScreen montado");
    
    if (userEmail) {
      console.log(`Usuario: ${userEmail}`);
      loadTasks();
    } else {
      console.warn("Esperando email del usuario...");
    }
  }, [userEmail]);

  console.log(`Estado actual - Tareas: ${tasks.length}, Loading: ${isLoading}`);

  if (isLoading && tasks.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000000" />
          <Text className="text-gray-500 mt-4">Cargando tareas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userEmail) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-5">
          <LogIn size={48} color="#6B7280" style={{ marginBottom: 16 }} />
          <Text className="text-xl font-bold text-gray-900 mb-2">
            No hay sesión activa
          </Text>
          <Text className="text-gray-500 text-center">
            Por favor, inicia sesión para ver tus tareas
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Mis Tareas</Text>
            <Text className="text-sm text-gray-500 mt-1">{userEmail}</Text>
          </View>

          <Link href="/(home)/tasks/create" asChild>
            <Pressable className="bg-gray-900 px-4 py-2 rounded-lg flex-row items-center">
              <Plus size={18} color="white" style={{ marginRight: 6 }} />
              <Text className="text-white font-semibold">Nueva</Text>
            </Pressable>
          </Link>
        </View>

        <FlatList
          data={tasks}
          onRefresh={loadTasks}
          refreshing={isLoading}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => <TaskItem task={item} />}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <ClipboardList size={64} color="#D1D5DB" style={{ marginBottom: 16 }} />
              <Text className="text-center text-gray-900 text-lg mb-2 font-semibold">
                No tienes tareas aún
              </Text>
              <Text className="text-center text-gray-500">
                Presiona "Nueva" para crear una
              </Text>
            </View>
          }
          contentContainerStyle={tasks.length === 0 ? { flex: 1 } : undefined}
        />
      </View>
    </SafeAreaView>
  );
}