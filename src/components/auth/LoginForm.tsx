'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('🔐 Intentando login con:', data.email)
      setIsLoading(true)
      setAuthError('')

      // QUITAR updateSession que causa error
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      console.log('📨 Respuesta de Supabase:', { 
        user: authData.user ? '✅ Usuario recibido' : '❌ Sin usuario',
        session: authData.session ? '✅ Sesión recibida' : '❌ Sin sesión',
        error: error ? `❌ ${error.message}` : '✅ Sin errores'
      })

      if (error) {
        console.error('❌ Error de autenticación:', error)
        if (error.message.includes('Invalid login credentials')) {
          setAuthError('Email o contraseña incorrectos')
        } else {
          setAuthError(error.message)
        }
        return
      }

      if (authData.user && authData.session) {
        console.log('✅ Login exitoso')
        console.log('💾 Sesión establecida, esperando propagación...')
        
        // Esperar más tiempo para que las cookies se establezcan
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('🚀 Redirigiendo al dashboard...')
        // Forzar recarga completa para que el middleware vea las cookies
        window.location.href = '/dashboard'
      } else {
        console.warn('⚠️ Login sin usuario o sesión')
        setAuthError('Login incompleto. Inténtalo de nuevo.')
      }

    } catch (error) {
      console.error('💥 Error inesperado en login:', error)
      setAuthError('Error inesperado. Verifica tu conexión.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-gray-600 text-sm">
          Accede a tu catálogo de agentes especializados
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            placeholder="Tu contraseña"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {authError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{authError}</p>
          </div>
        )}

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
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          ¿No tienes cuenta?{' '}
          <Link 
            href="/register" 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}