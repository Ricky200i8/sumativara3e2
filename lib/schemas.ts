import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "Correo requerido").email("Correo inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Incluye mayúscula")
    .regex(/[a-z]/, "Incluye minúscula")
    .regex(/[0-9]/, "Incluye número"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "Nombre requerido"),
    email: z.string().min(1, "Correo requerido").email("Correo inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Incluye mayúscula")
      .regex(/[a-z]/, "Incluye minúscula")
      .regex(/[0-9]/, "Incluye número"),
    confirmPassword: z.string().min(1, "Confirma contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;