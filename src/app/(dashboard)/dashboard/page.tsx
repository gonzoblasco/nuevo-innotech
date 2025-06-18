// ===================================================================
// 📁 src/app/(dashboard)/dashboard/page.tsx
// ===================================================================
'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase/client'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  const handleSignOut = async () => {
    try {
      console.log('🚪 Cerrando sesión...')
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Mostrar loading si está cargando
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Mostrar info si no hay usuario (no debería pasar por el middleware)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No hay usuario autenticado</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 ¡Dashboard Funcionando!
              </h1>
              <p className="text-gray-600">
                Bienvenido, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ✅ ¡Sistema de Autenticación Completo!
          </h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              🎯 Tu autenticación está funcionando perfectamente.
            </p>
            <p className="text-green-700 text-sm mt-1">
              El login, las redirecciones y la protección de rutas están operativos.
            </p>
          </div>

          {/* Info del usuario */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Información del usuario:</h3>
            <div className="text-sm space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Nombre:</strong> {user?.user_metadata?.full_name || 'No especificado'}</p>
              <p><strong>ID:</strong> {user?.id?.slice(0, 8)}...</p>
              <p><strong>Email Verificado:</strong> {user?.email_confirmed_at ? '✅ Sí' : '❌ No'}</p>
              <p><strong>Última conexión:</strong> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'No disponible'}</p>
            </div>
          </div>

          {/* Próximos pasos */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              🚀 Próximos pasos del desarrollo:
            </h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Sprint 2: Catálogo de agentes conversacionales</li>
              <li>• Sprint 3: Sistema de chat y mensajería</li>
              <li>• Sprint 4: Exportación de contexto</li>
              <li>• Sprint 5: Sistema de suscripciones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}