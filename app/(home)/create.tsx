import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTasks } from "@/context/TaskContext";
import { StorageService, type User } from "@/lib/storage";
import CustomInput from "@/components/CustomImput";

export default function CreateTask() {
  const router = useRouter();
  const { addTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario correctamente
  useEffect(() => {
    const load = async () => {
      const current = await StorageService.getCurrentUser();
      setUser(current);
    };
    load();
  }, []);

  const handleSave = async () => {
    // PREVENIR que el botón no funcione por falta de user
    if (!user) {
      console.log("Usuario no cargado aún");
      return;
    }

    await addTask({
      title,
      description,
      completed: false,
      userEmail: user.email,
    });

    router.back();
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <Text className="text-2xl font-bold mb-4">Nueva Tarea</Text>

      <CustomInput placeholder="Título" value={title} onChangeText={setTitle} />
      <CustomInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />

      <Pressable
      
        className="bg-blue-600 p-4 rounded-xl mt-4"
        onPress={handleSave}
        >
        <Text className="text-white text-center font-semibold text-lg">
          Guardar
        </Text>
        
      </Pressable>
      
    </View>
  );
}
