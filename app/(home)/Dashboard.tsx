import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Link } from 'expo-router';
import { useTasks } from '@/context/TaskContext';
import TaskItem from '@/components/TaskItem';
import EmptyState from '@/components/EmptyState';
import { Plus } from 'lucide-react-native';

export default function HomeScreen() {
  const { tasks, loading, refreshTasks } = useTasks();

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshTasks} />
        }
        ListEmptyComponent={<EmptyState />}
        contentContainerClassName="pb-24 pt-4"
        renderItem={({ item }) => <TaskItem task={item} />}
      />

      {/* FAB - Botón flotante */}
      <Link href="/(tabs)/add" asChild>
        <View className="absolute bottom-8 right-6">
          <View className="bg-blue-600 rounded-full p-5 shadow-2xl">
            <Plus color="white" size={32} />
          </View>
        </View>
      </Link>
    </View>
  );
}