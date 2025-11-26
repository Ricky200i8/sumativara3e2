import { useLocalSearchParams, useRouter } from "expo-router";
import { useTasks } from "@/context/TaskContext";
import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import CustomInput from "@/components/CustomImput";

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { tasks, updateTask } = useTasks();

  const task = tasks.find((t) => t.id === Number(id));

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  const handleUpdate = async () => {
    await updateTask(Number(id), {
      ...task!,
      title,
      description,
    });

    router.back();
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-4">Editar Tarea</Text>

      <CustomInput value={title} onChangeText={setTitle} placeholder="Título" />
      <CustomInput value={description} onChangeText={setDescription} placeholder="Descripción" />

      <Pressable
        className="bg-green-600 p-4 rounded-xl mt-4"
        onPress={handleUpdate}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Actualizar
        </Text>
      </Pressable>
    </View>
  );
}
