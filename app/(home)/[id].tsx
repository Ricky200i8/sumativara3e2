import { View, Text, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router, Link } from 'expo-router';
import { useTasks } from '@/context/TaskContext';
import TaskForm from '@/components/TaskForm';
import { ArrowLeft, Trash2 } from 'lucide-react-native';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, deleteTask } = useTasks();
  const task = tasks.find((t) => t.id === Number(id));

  if (!task) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-500">Tarea no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar tarea",
      "¿Estás seguro de eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteTask(task.id);
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center p-6 bg-white border-b border-gray-200">
        <Link href="/(tabs)" asChild>
          <ArrowLeft size={28} color="#374151" />
        </Link>
        <Text className="text-2xl font-bold text-gray-800">Editar tarea</Text>
        <Trash2 size={28} color="#ef4444" onPress={handleDelete} />
      </View>

      <View className="flex-1 px-6 pt-6">
        <TaskForm
          initialValues={{ title: task.title, description: task.description }}
          onSubmit={(data) => updateTask(task.id, data).then(() => router.back())}
        />
      </View>
    </KeyboardAvoidingView>
  );
}