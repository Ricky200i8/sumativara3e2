import React, { useState } from "react";
import { TextInput, View, Text, Pressable } from "react-native";

interface CustomInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  icon?: string;
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
        className={`flex-row items-center h-14 px-4 border-2 rounded-xl bg-gray-50 ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-blue-500 bg-white"
            : "border-gray-200"
        }`}
      >
        {icon && <Text className="text-xl mr-3">{icon}</Text>}
        
        <TextInput
          className="flex-1 text-base text-gray-800"
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
            className="ml-2"
          >
            <Text className="text-xl">
              {isPasswordVisible ? "👁️" : "🙈"}
            </Text>
          </Pressable>
        )}
      </View>
      
      {error && (
        <View className="flex-row items-center mt-1 ml-1">
          <Text className="text-xs mr-1">⚠️</Text>
          <Text className="text-red-500 text-sm">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default CustomInput;