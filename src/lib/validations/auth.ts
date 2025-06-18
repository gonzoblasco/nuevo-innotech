// ===================================================================
// 📁 CREAR ARCHIVO: src/lib/validations/auth.ts
// ===================================================================
/**
 * Esquemas de validación con Zod para los formularios de autenticación
 */
import { z } from 'zod'

// Esquema base para email con validaciones específicas
const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('Ingresa un email válido')
  .toLowerCase()
  .trim()

// Esquema base para contraseña con requisitos de seguridad
const passwordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(100, 'La contraseña no puede exceder 100 caracteres')

// Esquema para el formulario de login
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

// Esquema para el formulario de registro con confirmación de contraseña
export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .trim(),
    email: emailSchema,
    password: passwordSchema,
    confirm_password: z.string()
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password']
  })

// Tipos TypeScript derivados de los esquemas
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>