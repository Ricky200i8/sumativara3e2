import { Pressable, View, Text, CheckBox } from 'react-native';
import { Link } from 'expo-router';
import { useTasks } from '@/context/TaskContext';

export default function TaskItem({ task }: { task: Task }) {
  const { updateTask } = useTasks();

  return (
    <Link href={`/task/${task.id}`} asChild>
      <Pressable className="bg-white p-4 mx-4 my-2 rounded-lg shadow">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </Text>
            {task.description ? <Text className="text-gray-600 mt-1">{task.description}</Text> : null}
          </View>
          <CheckBox
            value={task.completed}
            onValueChange={() => updateTask(task.id, { completed: !task.completed })}
          />
        </View>
      </Pressable>
    </Link>
  );
}