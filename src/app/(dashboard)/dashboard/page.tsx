// ===================================================================
// 📁 ARCHIVO: src/app/(dashboard)/dashboard/page.tsx (CORREGIDO)
// ===================================================================
/**
 * Página principal del dashboard - Client Component
 * 
 * Características:
 * - Client Component para acceso a AuthProvider
 * - Manejo correcto de estados de autenticación
 * - Componentes del dashboard integrados
 * - Datos mock preparados para desarrollo
 */
'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import UsageStats from '@/components/dashboard/UsageStats'
import AgentCard from '@/components/dashboard/AgentCard'
import RecentSessions from '@/components/dashboard/RecentSessions'

// Definir interfaz User que coincida con WelcomeSection
interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

// Datos mock para desarrollo (TODO: reemplazar con datos reales de Supabase)
const mockUsageData = {
  messagesUsed: 45,
  messagesLimit: 100,
  currentPlan: 'Lite',
  sessionsCompleted: 8
}

const mockRecentSessions = [
  {
    id: '1',
    agentName: 'Arquitecto de Decisiones',
    title: 'Estrategia de lanzamiento de producto',
    lastMessage: 'Considera realizar un MVP con las funcionalidades core...',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    status: 'completed' as const
  },
  {
    id: '2',
    agentName: 'Experto en Marketing',
    title: 'Análisis de competencia',
    lastMessage: 'He identificado 3 competidores principales...',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 día atrás
    status: 'active' as const
  },
  {
    id: '3',
    agentName: 'Consultor Financiero',
    title: 'Proyección de ingresos Q1',
    lastMessage: 'Basándome en tus datos históricos...',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    status: 'completed' as const
  }
]

export default function DashboardPage() {
  // Obtener datos del usuario desde AuthProvider (Client Component)
  const { user, isLoading } = useAuth()

  // Mostrar loading si está cargando
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          {/* Skeleton de bienvenida */}
          <div className="bg-gray-200 rounded-xl h-32 mb-6"></div>
          
          {/* Skeleton del grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-200 rounded-xl h-48"></div>
              <div className="bg-gray-200 rounded-xl h-64"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-200 rounded-xl h-80"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar error si no hay usuario (backup del middleware)
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Error de autenticación
          </h2>
          <p className="text-red-700 mb-4">
            No se pudo verificar tu sesión. Por favor, inicia sesión nuevamente.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

  // Construir userProfile con tipos correctos (null en lugar de undefined)
  const userProfile: UserProfile = {
    id: user.id,
    email: user.email || null,
    full_name: user.user_metadata?.full_name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    created_at: user.created_at
  }

  return (
    <div className="space-y-8">
      {/* Sección de bienvenida */}
      <WelcomeSection 
        user={userProfile}
      />

      {/* Grid principal del dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Columna izquierda: Estadísticas y agente principal */}
        <div className="xl:col-span-3 space-y-8">
          {/* Estadísticas de uso */}
          <UsageStats 
            messagesUsed={mockUsageData.messagesUsed}
            messagesLimit={mockUsageData.messagesLimit}
            currentPlan={mockUsageData.currentPlan}
            sessionsCompleted={mockUsageData.sessionsCompleted}
          />

          {/* Agente principal destacado */}
          <AgentCard />
        </div>

        {/* Columna derecha: Historial de sesiones recientes */}
        <div className="xl:col-span-2">
          <RecentSessions sessions={mockRecentSessions} />
        </div>
      </div>
    </div>
  )
}