import React, { useState } from "react";
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import CustomInput from "@/components/CustomImput";
import { RegisterSchema } from "../../lib/schemas";
import { AuthTexts } from "../../constants/auth";
import { StorageService } from "../../lib/storage";

type CustomRoute = "/(home)/Dashboard";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setErrors({});
    setIsLoading(true);

    try {
      const result = RegisterSchema.safeParse(form);
      
      if (!result.success) {
        const newErrors = result.error.issues.reduce(
          (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
          {}
        );
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const saved = await StorageService.saveUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (!saved) {
        Alert.alert(
          "Error",
          "Este correo ya está registrado. Por favor, inicia sesión.",
          [
            {
              text: "OK",
              onPress: () => router.push("/(auth)/Login")
            }
          ]
        );
        setIsLoading(false);
        return;
      }

      const path: CustomRoute = "/(home)/Dashboard";
      router.push(path);
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al registrar tu cuenta.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-8 bg-blue-50">
          <View className="max-w-md mx-auto w-full">
            <View className="mb-8">
              <Text className="text-4xl font-bold text-center text-gray-800 mb-2">
                {AuthTexts.REGISTER}
              </Text>
              <Text className="text-center text-gray-600">
                Crea tu cuenta para comenzar
              </Text>
            </View>

            <View className="bg-white p-6 rounded-2xl shadow-lg">
              <CustomInput
                placeholder={AuthTexts.NAME}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                error={errors.name}
                icon="👤"
              />
              <CustomInput
                placeholder={AuthTexts.EMAIL}
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                error={errors.email}
                icon="📧"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <CustomInput
                placeholder={AuthTexts.PASSWORD}
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
                secureTextEntry
                error={errors.password}
                icon="🔒"
              />
              <CustomInput
                placeholder="Confirmar Contraseña"
                value={form.confirmPassword}
                onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                secureTextEntry
                error={errors.confirmPassword}
                icon="🔒"
              />
              
              <Pressable
                className={`py-4 rounded-xl mt-4 ${
                  isLoading ? "bg-blue-400" : "bg-blue-600"
                }`}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-semibold">
                    {AuthTexts.REGISTER}
                  </Text>
                )}
              </Pressable>
            </View>

            <View className="mt-6">
              <Text className="text-center text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link href="/(auth)/Login" className="text-blue-600 font-semibold">
                  {AuthTexts.LOGIN}
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}