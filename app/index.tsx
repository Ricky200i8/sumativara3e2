import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { StorageService } from "../lib/storage";
import { Shield, CheckCircle2 } from "lucide-react-native";
import "@/global.css";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Pequeña pausa para mostrar el splash
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("🔍 Verificando autenticación...");
      const currentUser = await StorageService.getCurrentUser();
      
      if (currentUser) {
        console.log("✅ Usuario encontrado, redirigiendo a dashboard");
        router.replace("/(home)/dashboard");
      } else {
        console.log("⚠️ No hay sesión, redirigiendo a login");
        router.replace("/(auth)/Login");
      }
    } catch (error) {
      console.error("❌ Error verificando autenticación:", error);
      router.replace("/(auth)/Login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center">
          {/* Logo/Icono Principal */}
          <View className="w-32 h-32 bg-gray-900 rounded-2xl items-center justify-center mb-8 shadow-xl">
            <Shield size={64} color="white" strokeWidth={2} />
          </View>
          
          {/* Título de la App */}
          <Text className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            TaskManager
          </Text>
          
          {/* Subtítulo */}
          <View className="flex-row items-center mb-8">
            <CheckCircle2 size={18} color="#6B7280" style={{ marginRight: 6 }} />
            <Text className="text-base text-gray-500 font-medium">
              Organiza tu día, simplifica tu vida
            </Text>
          </View>
          
          {/* Loading Indicator */}
          <View className="mt-4">
            <ActivityIndicator size="large" color="#000000" />
            <Text className="text-gray-400 text-sm mt-4 text-center">
              Cargando...
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="absolute bottom-10">
          <Text className="text-gray-400 text-xs text-center">
            Versión 1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}