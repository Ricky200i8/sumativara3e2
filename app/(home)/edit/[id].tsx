import { useLocalSearchParams, useRouter } from "expo-router";
import { useTasks } from "@/context/TaskContext";
import { useState, useEffect } from "react";
import { View, Text, Pressable, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { Save, AlertCircle, X } from "lucide-react-native";
import CustomInput from "@/components/CustomImput";

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { tasks, updateTask, loadTasks } = useTasks();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    console.log("🔍 Buscando tarea con ID:", id);
    console.log("📊 Total de tareas:", tasks.length);
    
    // Si no hay tareas, cargarlas
    if (tasks.length === 0) {
      console.log("⏳ Cargando tareas desde el servidor...");
      loadTasks().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && id) {
      console.log("🔎 Buscando tarea con ID:", id, "tipo:", typeof id);
      console.log("📋 IDs disponibles:", tasks.map(t => ({ id: t.id, type: typeof t.id })));
      
      // Buscar tanto por string como por number
      const foundTask = tasks.find((t) => String(t.id) === String(id));
      
      if (foundTask) {
        console.log("✅ Tarea encontrada:", foundTask);
        setTask(foundTask);
        setTitle(foundTask.title);
        setDescription(foundTask.description);
      } else {
        console.error("❌ No se encontró tarea con ID:", id);
      }
    }
  }, [tasks, id]);

  const handleSave = async () => {
    console.log("💾 ===== GUARDANDO CAMBIOS =====");
    console.log("📌 ID del param:", id);
    console.log("📌 Task actual:", task);
    
    if (!task) {
      Alert.alert("Error", "No se pudo encontrar la tarea");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Error", "El título no puede estar vacío");
      return;
    }

    setIsSaving(true);

    try {
      console.log("🚀 Llamando a updateTask con:");
      console.log("  - ID:", id, "(tipo:", typeof id, ")");
      console.log("  - Título:", title);
      console.log("  - Descripción:", description);
      console.log("  - Completed:", task.completed);
      console.log("  - UserEmail:", task.userEmail);
      
      // Usar el ID directamente sin convertir a número
      await updateTask(id as string, {
        title: title.trim(),
        description: description.trim(),
        completed: task.completed,
        userEmail: task.userEmail,
      });
      
      console.log("✅ Tarea actualizada exitosamente");
      Alert.alert("Éxito", "Tarea actualizada correctamente", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios. Verifica tu conexión.");
    } finally {
      setIsSaving(false);
    }
  };

  // Mostrar loading mientras carga
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000000" />
          <Text className="text-gray-500 mt-4">Cargando tarea...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar error si no se encuentra la tarea
  if (!task && !isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center p-5">
          <AlertCircle size={64} color="#EF4444" style={{ marginBottom: 16 }} />
          <Text className="text-gray-900 font-bold text-xl mb-2">
            Tarea no encontrada
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            La tarea con ID {id} no existe o fue eliminada
          </Text>
          <Pressable
            className="bg-gray-900 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <Text className="text-2xl font-bold mb-6 text-gray-900">
          Editar Tarea
        </Text>

        <View className="mb-4">
          <Text className="text-sm text-gray-700 mb-2 font-semibold">
            Título <Text className="text-red-500">*</Text>
          </Text>
          <CustomInput 
            value={title} 
            onChangeText={setTitle}
            placeholder="Título de la tarea"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2 font-semibold">
            Descripción
          </Text>
          <CustomInput 
            value={description} 
            onChangeText={setDescription}
            placeholder="Descripción de la tarea"
          />
        </View>

        <View className="flex-row gap-3">
          <Pressable
            className="flex-1 bg-gray-200 p-4 rounded-lg items-center flex-row justify-center"
            onPress={() => router.back()}
            disabled={isSaving}
          >
            <X size={20} color="#374151" style={{ marginRight: 8 }} />
            <Text className="text-gray-900 font-semibold">Cancelar</Text>
          </Pressable>

          <Pressable 
            className={`flex-1 p-4 rounded-lg items-center flex-row justify-center ${
              isSaving ? "bg-gray-400" : "bg-gray-900"
            }`}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Save size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white text-center text-lg font-semibold">
                  Guardar
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}