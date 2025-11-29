import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTasks } from "@/context/TaskContext";

export default function CreateTaskScreen() {
  const router = useRouter();
  const { addTask, userEmail } = useTasks();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    // Validaciones
    if (!title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    if (!userEmail) {
      Alert.alert("Error", "No hay usuario logueado. Por favor inicia sesión nuevamente.");
      router.replace("/(auth)/Login");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📝 Creando tarea...");
      console.log("- Título:", title);
      console.log("- Descripción:", description);
      console.log("- Email del usuario:", userEmail);

      await addTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        userEmail: userEmail, // 🔥 Asociar tarea con el usuario
      });

      console.log("✅ Tarea creada exitosamente");
      
      Alert.alert(
        "¡Éxito!", 
        "Tarea creada correctamente",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("❌ Error al crear tarea:", error);
      Alert.alert(
        "Error", 
        "No se pudo crear la tarea. Verifica tu conexión al servidor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si no hay usuario, mostrar mensaje
  if (!userEmail) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-5">
        <Text className="text-xl font-bold text-gray-700 mb-2">
          No hay sesión activa
        </Text>
        <Text className="text-gray-500 text-center mb-4">
          Debes iniciar sesión para crear tareas
        </Text>
        <Pressable
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => router.replace("/(auth)/Login")}
        >
          <Text className="text-white font-semibold">
            Iniciar Sesión
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-6">Nueva Tarea</Text>

      <View className="mb-4">
        <Text className="text-sm text-gray-600 mb-2">
          📧 Usuario: <Text className="font-semibold">{userEmail}</Text>
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-sm text-gray-700 mb-2 font-semibold">
          Título <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-base"
          placeholder="Ej: Comprar víveres"
          value={title}
          onChangeText={setTitle}
          editable={!isSubmitting}
          maxLength={100}
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm text-gray-700 mb-2 font-semibold">
          Descripción
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-base h-32"
          placeholder="Detalles de la tarea..."
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          editable={!isSubmitting}
          maxLength={500}
        />
      </View>

      <View className="flex-row gap-3">
        <Pressable
          className="flex-1 bg-gray-200 p-4 rounded-lg items-center"
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text className="text-gray-700 font-semibold text-base">
            Cancelar
          </Text>
        </Pressable>

        <Pressable
          className={`flex-1 p-4 rounded-lg items-center ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleCreate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Crear Tarea
            </Text>
          )}
        </Pressable>
      </View>

      {isSubmitting && (
        <View className="mt-4 p-3 bg-blue-50 rounded-lg">
          <Text className="text-blue-600 text-center text-sm">
            📡 Guardando tarea en el servidor...
          </Text>
        </View>
      )}
    </View>
  );
}