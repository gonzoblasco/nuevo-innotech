// ===================================================================
// 📁 ARCHIVO: src/components/dashboard/UsageStats.tsx
// ===================================================================
'use client'

import { MessageSquare, CreditCard, Activity, Trophy } from 'lucide-react'

interface UsageStatsProps {
  messagesUsed: number
  messagesLimit: number
  currentPlan: string
  sessionsCompleted: number
}

export default function UsageStats({ 
  messagesUsed, 
  messagesLimit, 
  currentPlan, 
  sessionsCompleted 
}: UsageStatsProps) {
  const usagePercentage = Math.round((messagesUsed / messagesLimit) * 100)
  
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPlanColor = (plan: string): string => {
    switch (plan.toLowerCase()) {
      case 'lite': return 'bg-gray-100 text-gray-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'elite': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = [
    {
      icon: MessageSquare,
      title: 'Mensajes este mes',
      value: `${messagesUsed}/${messagesLimit}`,
      subtitle: `${usagePercentage}% utilizado`,
      hasProgress: true,
      progressPercentage: usagePercentage,
      progressColor: getProgressColor(usagePercentage)
    },
    {
      icon: CreditCard,
      title: 'Plan actual',
      value: currentPlan,
      subtitle: currentPlan === 'Lite' ? 'Plan gratuito' : `Plan ${currentPlan}`,
      badge: true,
      badgeColor: getPlanColor(currentPlan)
    },
    {
      icon: Activity,
      title: 'Sesiones completadas',
      value: sessionsCompleted.toString(),
      subtitle: 'Este mes'
    },
    {
      icon: Trophy,
      title: 'Agentes utilizados',
      value: '3',
      subtitle: 'Diferentes especialistas'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Estadísticas de Uso
        </h2>
        <p className="text-sm text-gray-600">
          Resumen de tu actividad y uso de la plataforma
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <div 
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {stat.title}
                  </h3>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  {stat.badge && (
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${stat.badgeColor}`}>
                      {stat.value}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {stat.subtitle}
                </p>
                
                {stat.hasProgress && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${stat.progressColor}`}
                      style={{ width: `${stat.progressPercentage}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {usagePercentage >= 80 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-yellow-800">
                {usagePercentage >= 90 ? '¡Límite casi alcanzado!' : 'Acercándote al límite'}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {usagePercentage >= 90 
                  ? 'Considera actualizar tu plan para continuar usando todos los agentes.'
                  : 'Te quedan pocos mensajes disponibles este mes.'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}