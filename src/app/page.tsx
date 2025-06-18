// ===================================================================
// 📁 ARCHIVO: src/app/page.tsx
// ===================================================================
/**
 * Página principal de la aplicación (Landing Page)
 * 
 * Esta es una página temporal que será reemplazada por el landing page completo.
 * Por ahora, redirige a los usuarios autenticados al dashboard y a los no autenticados al login.
 */
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import Link from 'next/link'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si el usuario está autenticado, redirigir al dashboard
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, mostrar landing page temporal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo y título */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">InnoTech</span> Solutions
          </h1>
          
          <h2 className="text-xl md:text-2xl text-gray-700 mb-8">
            El Netflix de Agentes Conversacionales
          </h2>
          
          {/* Descripción */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            La primera plataforma que te permite acceder a un catálogo de 
            <span className="font-semibold text-blue-700"> agentes de IA especializados</span>, 
            cada uno diseñado como el experto perfecto para resolver problemas específicos 
            de emprendedores y PyMEs latinos.
          </p>

          {/* Features principales */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎯 Especialización Real
              </h3>
              <p className="text-gray-600">
                Cada agente domina su área como un experto real
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💬 Continuidad de Sesión
              </h3>
              <p className="text-gray-600">
                Exporta el contexto y retoma conversaciones sin perder el hilo
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🌎 Localización Total
              </h3>
              <p className="text-gray-600">
                Agentes que entienden el mercado argentino y latino
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link 
              href="/register"
              className="block md:inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Comenzar Gratis
            </Link>
            
            <Link 
              href="/login"
              className="block md:inline-block bg-white hover:bg-gray-50 text-blue-600 font-semibold py-4 px-8 rounded-lg border-2 border-blue-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Información de precios */}
          <p className="text-sm text-gray-500 mt-8">
            Plan gratuito disponible • No se requiere tarjeta de crédito
          </p>
        </div>
      </div>
    </div>
  )
}