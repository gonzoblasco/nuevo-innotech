// ===================================================================
// 📁 ARCHIVO: src/components/auth/RegisterForm.tsx
// ===================================================================
/**
 * Componente de formulario de registro con diseño mobile-first
 * 
 * Características:
 * - Validación completa incluyendo confirmación de contraseña
 * - Estados de carga y error
 * - Diseño responsive priorizando móviles
 * - Integración completa con Supabase Auth
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const router = useRouter()

  // Configuración del formulario con react-hook-form y validación Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange' // Validación en tiempo real
  })

  // Observar el campo password para validar confirmación en tiempo real
  const password = watch('password')

  // Función para manejar el envío del formulario
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setAuthError('')
      setSuccessMessage('')

      // Intentar registrar usuario con Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name
          }
        }
      })

      if (error) {
        // Manejar errores específicos de registro
        if (error.message.includes('User already registered')) {
          setAuthError('Ya existe una cuenta con este email')
        } else if (error.message.includes('Password should be')) {
          setAuthError('La contraseña no cumple con los requisitos mínimos')
        } else {
          setAuthError(error.message)
        }
        return
      }

      // Si el registro es exitoso
      if (authData.user) {
        if (authData.user.email_confirmed_at) {
          // Email confirmado automáticamente, redirigir al dashboard
          router.push('/dashboard')
          router.refresh()
        } else {
          // Mostrar mensaje de confirmación de email
          setSuccessMessage(
            'Cuenta creada exitosamente. Por favor revisa tu email para confirmar tu cuenta.'
          )
        }
      }

    } catch (error) {
      console.error('Error en registro:', error)
      setAuthError('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header del formulario */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-gray-600 text-sm">
          Únete a InnoTech Solutions y accede a agentes especializados
        </p>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">
            {successMessage}
          </p>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo Nombre Completo */}
        <div>
          <label 
            htmlFor="full_name" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre Completo
          </label>
          <input
            {...register('full_name')}
            type="text"
            id="full_name"
            placeholder="Tu nombre completo"
            className={`
              w-full px-4 py-3 rounded-lg border transition-colors
              ${errors.full_name 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-50 disabled:cursor-not-allowed
            `}
            disabled={isLoading}
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Campo Email */}
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="tu@email.com"
            className={`
              w-full px-4 py-3 rounded-lg border transition-colors
              ${errors.email 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-50 disabled:cursor-not-allowed
            `}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Campo Contraseña */}
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contraseña
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            placeholder="Mínimo 6 caracteres"
            className={`
              w-full px-4 py-3 rounded-lg border transition-colors
              ${errors.password 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-50 disabled:cursor-not-allowed
            `}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Campo Confirmar Contraseña */}
        <div>
          <label 
            htmlFor="confirm_password" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirmar Contraseña
          </label>
          <input
            {...register('confirm_password')}
            type="password"
            id="confirm_password"
            placeholder="Repite tu contraseña"
            className={`
              w-full px-4 py-3 rounded-lg border transition-colors
              ${errors.confirm_password 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-gray-50 disabled:cursor-not-allowed
            `}
            disabled={isLoading}
          />
          {errors.confirm_password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {/* Error de autenticación */}
        {authError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">
              {authError}
            </p>
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all
            ${isLoading || !isValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creando cuenta...
            </span>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>

      {/* Link de login */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link 
            href="/login" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}