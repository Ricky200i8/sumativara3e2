import React, { useState } from "react";
import { TextInput, View, Text, Pressable } from "react-native";
import { Eye, EyeOff, AlertCircle } from "lucide-react-native";

interface CustomInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  icon?: React.ReactNode;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  icon,
  keyboardType = "default",
  autoCapitalize = "sentences",
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <View
        className={`flex-row items-center h-14 px-4 border rounded-lg bg-white ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-gray-900 bg-gray-50"
            : "border-gray-300"
        }`}
      >
        {icon && (
          <View className="mr-3">
            {icon}
          </View>
        )}
        
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-2 p-1"
          >
            {isPasswordVisible ? (
              <Eye size={20} color="#6B7280" />
            ) : (
              <EyeOff size={20} color="#6B7280" />
            )}
          </Pressable>
        )}
      </View>
      
      {error && (
        <View className="flex-row items-center mt-2 ml-1">
          <AlertCircle size={14} color="#EF4444" style={{ marginRight: 6 }} />
          <Text className="text-red-500 text-sm">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default CustomInput;