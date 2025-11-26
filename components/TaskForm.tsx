import { useForm } from 'react-hook-form';
import { TextInput, Button, View } from 'react-native';

type FormData = {
  title: string;
  description?: string;
};

export default function TaskForm({ initialValues, onSubmit }: {
  initialValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
}) {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: initialValues || { title: '', description: '' },
  });

  return (
    <>
      {/* Usa Controller de react-hook-form o tu librería favorita (nativewind + tailwind-rn, etc) */}
      {/* Aquí un ejemplo simple */}
      <Controller
        control={control}
        name="title"
        rules={{ required: true }}
        render={({ field }) => (
          <TextInput
            placeholder="Título de la tarea"
            className="border border-gray-300 rounded-lg p-4 mb-4"
            onChangeText={field.onChange}
            value={field.value}
          />
        )}
      />
      {/* ... igual con description */}
      <Button title={isSubmitting ? "Guardando..." : "Guardar"} onPress={handleSubmit(onSubmit)} />
    </>
  );
}