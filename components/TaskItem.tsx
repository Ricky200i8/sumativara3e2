import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Task } from "@/services/api";
import { useTasks } from "@/context/TaskContext";

export default function TaskItem({ task }: { task: Task }) {
  const { deleteTask } = useTasks();

  return (
    <View className="p-4 bg-gray-100 mb-3 rounded-xl">
      <Text className="text-lg font-semibold">{task.title}</Text>
      <Text className="text-gray-600">{task.description}</Text>

      <View className="flex-row gap-4 mt-2">
      <Link 
  href={{
    pathname: "/(home)/edit/[id]",
    params: { id: String(task.id) }
  }}
>
  <Text>Editar</Text>
</Link>


        <Pressable onPress={() => deleteTask(task.id!)}>
          <Text className="text-red-500">Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}
