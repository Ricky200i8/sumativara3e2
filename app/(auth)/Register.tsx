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
import { User as UserIcon, Mail, Lock } from "lucide-react-native";
import CustomInput from "@/components/CustomImput";
import { RegisterSchema } from "../../lib/schemas";
import { AuthTexts } from "../../constants/auth";
import { StorageService } from "../../lib/storage";
import { UserAPI } from "../../services/api";

type CustomRoute = "/(home)/dashboard";

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

      console.log("📝 Registrando usuario:", form.email);

      try {
        // Registrar usuario en JSON Server
        const newUser = await UserAPI.register({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        console.log("✅ Usuario registrado exitosamente");

        // Guardar sesión automáticamente
        await StorageService.setCurrentUser(newUser);
        console.log("✅ Sesión iniciada automáticamente");

        // Redirigir al dashboard
        Alert.alert(
          "¡Bienvenido!",
          `Tu cuenta ha sido creada exitosamente, ${form.name}`,
          [
            {
              text: "Continuar",
              onPress: () => router.replace("/(home)/dashboard")
            }
          ]
        );
      } catch (error: any) {
        if (error.message === 'EMAIL_EXISTS') {
          Alert.alert(
            "Error",
            "Este correo ya está registrado. Por favor, inicia sesión.",
            [{ text: "Ir a Login", onPress: () => router.push("/(auth)/Login") }]
          );
        } else {
          throw error;
        }
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al registrar tu cuenta.");
      console.error("❌ Error en registro:", error);
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
                  {AuthTexts.REGISTER}
                </Text>
                <Text className="text-center text-gray-500">
                  Crea tu cuenta para comenzar
                </Text>
              </View>

              <View className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <CustomInput
                  placeholder={AuthTexts.NAME}
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  error={errors.name}
                  icon={<UserIcon size={20} color="#6B7280" />}
                />

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

                <CustomInput
                  placeholder="Confirmar Contraseña"
                  value={form.confirmPassword}
                  onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                  secureTextEntry
                  error={errors.confirmPassword}
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
                      {AuthTexts.REGISTER}
                    </Text>
                  )}
                </Pressable>
              </View>

              <View className="mt-6">
                <Text className="text-center text-gray-600">
                  ¿Ya tienes cuenta?{" "}
                  <Link href="/(auth)/Login" className="text-gray-900 font-semibold">
                    {AuthTexts.LOGIN}
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