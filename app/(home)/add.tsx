import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import TaskForm from '@/components/TaskForm';
import { useTasks } from '@/context/TaskContext';

import { ArrowLeft } from 'lucide-react-native';

export default function AddTaskScreen() {
  const { addTask } = useTasks();
  const { user } = useAuth();

  const handleSubmit = async (data: { title: string; description?: string }) => {
    await addTask({
      ...data,
      completed: false,
      createdAt: new Date().toISODate(),
      userId: user!.id,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-row items-center p-6 bg-white border-b border-gray-200">
        <Link href=".." asChild>
          <ArrowLeft size={28} color="#374151" />
        </Link>
        <Text className="text-2xl font-bold ml-4 text-gray-800">Nueva tarea</Text>
      </View>

      <View className="flex-1 px-6 pt-6">
        <TaskForm onSubmit={handleSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}