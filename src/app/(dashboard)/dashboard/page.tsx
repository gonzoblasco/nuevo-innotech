// ===================================================================
// 📁 ARCHIVO: src/app/(dashboard)/dashboard/page.tsx (TIPOS CORREGIDOS)
// ===================================================================
/**
 * Página principal del dashboard con tipos corregidos
 * 
 * Características:
 * - Tipos compatibles entre Supabase User y componentes
 * - Manejo correcto de undefined vs null
 * - Server Component optimizado
 */
import { createClient } from '@/lib/supabase/server'
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

export default async function DashboardPage() {
  // Obtener datos del usuario desde Supabase (Server Component)
  const supabase = await createClient()
  
  let userProfile: UserProfile | null = null
  let error: string | null = null

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Error obteniendo usuario:', authError)
      error = authError.message
    } else if (user) {
      // Construir userProfile con tipos correctos (null en lugar de undefined)
      userProfile = {
        id: user.id,
        email: user.email || null, // Convertir undefined a null
        full_name: user.user_metadata?.full_name || null, // Convertir undefined a null
        avatar_url: user.user_metadata?.avatar_url || null, // Convertir undefined a null
        created_at: user.created_at
      }
    }
  } catch (err) {
    console.error('Error inesperado:', err)
    error = 'Error inesperado al cargar datos'
  }

  // Si hay error, mostrar estado de error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Error al cargar el dashboard
          </h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Sección de bienvenida */}
      <WelcomeSection 
        user={userProfile}
      />

      {/* Grid principal del dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Estadísticas y agente principal */}
        <div className="lg:col-span-2 space-y-6">
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
        <div className="lg:col-span-1">
          <RecentSessions sessions={mockRecentSessions} />
        </div>
      </div>
    </div>
  )
}