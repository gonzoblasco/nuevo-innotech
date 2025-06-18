// ===================================================================
// 📁 ARCHIVO: src/components/dashboard/RecentSessions.tsx (TIPOGRAFÍA COMPACTA)
// ===================================================================
/**
 * Componente para mostrar el historial de sesiones recientes
 * 
 * Características:
 * - Tipografía más compacta para aprovechar mejor el espacio
 * - Lista de las últimas 5 sesiones
 * - Estados visuales (activa, completada)
 * - Timestamps relativos
 * - Enlaces a continuar/revisar sesiones
 */
'use client'

import { MessageSquare, Clock, CheckCircle, Play, Eye } from 'lucide-react'

interface Session {
  id: string
  agentName: string
  title: string
  lastMessage: string
  timestamp: Date
  status: 'active' | 'completed'
}

interface RecentSessionsProps {
  sessions: Session[]
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  // Función para formatear tiempo relativo (versión simple sin dependencias)
  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return 'Hace un momento'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    if (diffInDays === 1) return 'Ayer'
    if (diffInDays < 7) return `Hace ${diffInDays} días`
    
    return date.toLocaleDateString('es-AR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  // Función para manejar click en sesión
  const handleSessionClick = (session: Session) => {
    if (session.status === 'active') {
      console.log('Continuando sesión:', session.id)
    } else {
      console.log('Revisando sesión completada:', session.id)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 h-fit">
      {/* Header con tipografía más compacta */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Sesiones Recientes
          </h2>
          <p className="text-xs text-gray-600">
            Tus últimas conversaciones con agentes
          </p>
        </div>
        
        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors">
          Ver todas
        </button>
      </div>

      {/* Lista de sesiones con espaciado reducido */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          // Estado vacío
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xs font-medium text-gray-900 mb-1">
              No hay sesiones recientes
            </h3>
            <p className="text-xs text-gray-600">
              Comienza tu primera conversación con un agente especializado
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => handleSessionClick(session)}
              className="group p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-100 hover:border-blue-200 cursor-pointer transition-all duration-200"
            >
              {/* Header de la sesión con tipografía más pequeña */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-xs font-semibold text-gray-900 truncate flex-1 min-w-0">
                      {session.title}
                    </h3>
                    
                    {/* Status badge más pequeño */}
                    <span className={`
                      inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0
                      ${session.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {session.status === 'active' ? (
                        <>
                          <Play className="h-2.5 w-2.5 mr-1" />
                          Activa
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-2.5 w-2.5 mr-1" />
                          Completada
                        </>
                      )}
                    </span>
                  </div>
                  
                  <p className="text-xs text-blue-600 font-medium">
                    {session.agentName}
                  </p>
                </div>

                {/* Acción rápida con ícono más pequeño */}
                <div className="flex-shrink-0 ml-2">
                  {session.status === 'active' ? (
                    <Play className="h-3 w-3 text-green-600 group-hover:text-green-700" />
                  ) : (
                    <Eye className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                  )}
                </div>
              </div>

              {/* Último mensaje con tipografía más pequeña */}
              <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                {session.lastMessage}
              </p>

              {/* Footer con timestamp más pequeño */}
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-2.5 w-2.5 mr-1" />
                <span>{formatRelativeTime(session.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con link a historial completo */}
      {sessions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <button className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Ver historial completo →
          </button>
        </div>
      )}
    </div>
  )
}