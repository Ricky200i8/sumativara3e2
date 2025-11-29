import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { StorageService } from "@/lib/storage";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await StorageService.logout();
    router.replace("/"); // vuelve al login
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold mb-5">Settings</Text>

      {/* =============================
          Botón: Editar perfil
      ============================== */}
      <Pressable className="bg-gray-200 p-4 rounded-xl mb-4">
        <Text className="text-lg">Editar perfil</Text>
      </Pressable>

      {/* =============================
          Botón: Cambiar tema
      ============================== */}
      <Pressable className="bg-gray-200 p-4 rounded-xl mb-4">
        <Text className="text-lg">Cambiar tema (Dark/Light)</Text>
      </Pressable>

      {/* =============================
          Botón: Información del app
      ============================== */}
      <Pressable className="bg-gray-200 p-4 rounded-xl mb-4">
        <Text className="text-lg">Sobre la aplicación</Text>
      </Pressable>

      {/* =============================
          Botón: Cerrar sesión
      ============================== */}
      <Pressable
        className="bg-red-600 p-4 rounded-xl mt-10"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Cerrar Sesión
        </Text>
      </Pressable>
    </View>
  );
}
