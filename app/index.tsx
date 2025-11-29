import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { StorageService } from "../lib/storage";
import "@/global.css";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const currentUser = await StorageService.getCurrentUser();
      
      if (currentUser) {
        router.replace("/(home)/dashboard");
      } else {
        router.replace("/(auth)/Login");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      router.replace("/(auth)/Login");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-blue-600">
      <View className="items-center">
        <View className="w-32 h-32 bg-white rounded-3xl items-center justify-center mb-6 shadow-lg">
          <Text className="text-6xl">🔐</Text>
        </View>
        <Text className="text-4xl font-bold text-white mb-2">Zod Auth</Text>
        <Text className="text-lg text-blue-100 mb-8">Autenticación Segura</Text>
        <ActivityIndicator size="large" color="white" />
      </View>
    </View>
  );
}