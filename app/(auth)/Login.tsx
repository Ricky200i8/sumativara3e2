import React, { useState } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  SafeAreaView 
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Mail, Lock } from "lucide-react-native";
import CustomInput from "@/components/CustomImput";
import { LoginSchema } from "../../lib/schemas";
import { AuthTexts } from "../../constants/auth";
import { StorageService } from "../../lib/storage";
import { UserAPI } from "../../services/api";

export default function LoginScreen() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setErrors({});
    setIsLoading(true);

    try {
      const result = LoginSchema.safeParse(form);
      
      if (!result.success) {
        const newErrors = result.error.issues.reduce(
          (acc, issue) => ({ ...acc, [issue.path[0]]: issue.message }),
          {}
        );
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      console.log("🔐 Iniciando sesión...");

      // Verificar credenciales en JSON Server
      const user = await UserAPI.login(form.email, form.password);
      
      if (!user) {
        Alert.alert(
          "Error de Inicio de Sesión",
          "Correo o contraseña incorrectos. Si no tienes cuenta, regístrate primero.",
          [
            { text: "Intentar de nuevo", style: "cancel" },
            { text: "Registrarse", onPress: () => router.push("/(auth)/Register") }
          ]
        );
        setIsLoading(false);
        return;
      }

      // Guardar sesión localmente
      await StorageService.setCurrentUser(user);
      console.log("✅ Login exitoso, redirigiendo a home...");

      // Redirigir al dashboard
      router.replace("/(home)/dashboard");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al iniciar sesión.");
      console.error("❌ Error en login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6 py-8 bg-white">
            <View className="max-w-md mx-auto w-full">
              <View className="mb-8">
                <Text className="text-4xl font-bold text-center text-gray-900 mb-2">
                  {AuthTexts.LOGIN}
                </Text>
                <Text className="text-center text-gray-500">
                  Bienvenido de nuevo
                </Text>
              </View>

              <View className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <CustomInput
                  placeholder={AuthTexts.EMAIL}
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  error={errors.email}
                  icon={<Mail size={20} color="#6B7280" />}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <CustomInput
                  placeholder={AuthTexts.PASSWORD}
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  secureTextEntry
                  error={errors.password}
                  icon={<Lock size={20} color="#6B7280" />}
                />

                <Pressable
                  className={`py-4 rounded-lg mt-4 ${
                    isLoading ? "bg-gray-400" : "bg-gray-900"
                  }`}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-center text-lg font-semibold">
                      {AuthTexts.LOGIN}
                    </Text>
                  )}
                </Pressable>
              </View>

              <View className="mt-6">
                <Text className="text-center text-gray-600">
                  {AuthTexts.NO_ACCOUNT}{" "}
                  <Link href="/(auth)/Register" className="text-gray-900 font-semibold">
                    {AuthTexts.SIGN_UP}
                  </Link>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}