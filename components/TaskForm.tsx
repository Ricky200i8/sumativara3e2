import { Controller, useForm } from "react-hook-form";
import { TextInput, Button, View } from "react-native";

type FormData = {
  title: string;
  description?: string;
};

export default function TaskForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
}) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: initialValues || { title: "", description: "" },
  });

  return (
    <View>
      {/* Título */}
      <Controller
        control={control}
        name="title"
        rules={{ required: "El título es obligatorio" }}
        render={({ field }) => (
          <TextInput
            placeholder="Título de la tarea"
            className="border border-gray-300 rounded-lg p-4 mb-4"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      {/* Descripción */}
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextInput
            placeholder="Descripción (opcional)"
            className="border border-gray-300 rounded-lg p-4 mb-4"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      <Button
        title={isSubmitting ? "Guardando..." : "Guardar"}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}
