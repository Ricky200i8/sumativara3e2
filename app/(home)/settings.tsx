import { View, Text, Pressable, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { StorageService } from "@/lib/storage";
import { UserCircle, Palette, Info, LogOut, ChevronRight } from "lucide-react-native";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await StorageService.logout();
    router.replace("/");
  };

  const SettingsButton = ({ 
    icon: Icon, 
    label, 
    onPress 
  }: { 
    icon: any; 
    label: string; 
    onPress?: () => void 
  }) => (
    <Pressable 
      className="bg-white p-4 rounded-lg mb-3 flex-row items-center justify-between border border-gray-200"
      onPress={onPress}
    >
      <View className="flex-row items-center flex-1">
        <Icon size={22} color="#374151" style={{ marginRight: 12 }} />
        <Text className="text-base text-gray-900">{label}</Text>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold mb-6 text-gray-900">
          Configuración
        </Text>

        <View className="mb-6">
          <SettingsButton
            icon={UserCircle}
            label="Editar perfil"
            onPress={() => {}}
          />

          <SettingsButton
            icon={Palette}
            label="Cambiar tema (Dark/Light)"
            onPress={() => {}}
          />

          <SettingsButton
            icon={Info}
            label="Sobre la aplicación"
            onPress={() => {}}
          />
        </View>

        <Pressable
          className="bg-gray-900 p-4 rounded-lg mt-auto flex-row items-center justify-center"
          onPress={handleLogout}
        >
          <LogOut size={20} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white text-lg font-semibold">
            Cerrar Sesión
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}