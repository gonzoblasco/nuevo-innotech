// ===================================================================
// 📁 ARCHIVO: src/app/(dashboard)/dashboard/page.tsx
// ===================================================================
/**
 * Página temporal del dashboard
 * 
 * Esta página será desarrollada en el Sprint 2.
 * Por ahora, muestra una interfaz básica para verificar que la autenticación funciona.
 */
'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Dashboard - InnoTech Solutions
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

        {/* Contenido temporal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🚧 En Desarrollo - Sprint 2
          </h2>
          
          <p className="text-gray-600 mb-6">
            El catálogo de agentes conversacionales y la interfaz de chat 
            serán desarrollados en el próximo sprint.
          </p>

          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              Información de tu cuenta:
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><strong>Email:</strong> {user?.email}</li>
              <li><strong>Nombre:</strong> {user?.user_metadata?.full_name || 'No especificado'}</li>
              <li><strong>ID:</strong> {user?.id}</li>
              <li><strong>Confirmado:</strong> {user?.email_confirmed_at ? 'Sí' : 'No'}</li>
              <li><strong>Creado:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'No disponible'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}