// ===================================================================
// 📁 ARCHIVO: src/components/dashboard/RecentSessions.tsx
// ===================================================================
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

  const handleSessionClick = (session: Session) => {
    if (session.status === 'active') {
      console.log('Continuando sesión:', session.id)
    } else {
      console.log('Revisando sesión completada:', session.id)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Sesiones Recientes
          </h2>
          <p className="text-sm text-gray-600">
            Tus últimas conversaciones con agentes
          </p>
        </div>
        
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              No hay sesiones recientes
            </h3>
            <p className="text-sm text-gray-600">
              Comienza tu primera conversación con un agente especializado
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => handleSessionClick(session)}
              className="group p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-100 hover:border-blue-200 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {session.title}
                    </h3>
                    
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status === 'active' ? (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Activa
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completada
                        </>
                      )}
                    </span>
                  </div>
                  
                  <p className="text-xs text-blue-600 font-medium">
                    {session.agentName}
                  </p>
                </div>

                <div className="flex-shrink-0 ml-2">
                  {session.status === 'active' ? (
                    <Play className="h-4 w-4 text-green-600 group-hover:text-green-700" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {session.lastMessage}
              </p>

              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatRelativeTime(session.timestamp)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {sessions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Ver historial completo →
          </button>
        </div>
      )}
    </div>
  )
}