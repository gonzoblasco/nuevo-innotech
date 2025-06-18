// ===================================================================
// 📁 ARCHIVO: src/components/dashboard/WelcomeSection.tsx
// ===================================================================
'use client'

import Image from 'next/image'
import { Clock, Calendar } from 'lucide-react'

interface User {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

interface WelcomeSectionProps {
  user: User | null
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const getGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const formatDate = (): string => {
    const now = new Date()
    return now.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const userName = user?.full_name || user?.email?.split('@')[0] || 'Usuario'

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mb-3 sm:mb-0">
            Bienvenido a tu centro de agentes conversacionales especializados
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 text-sm text-blue-100">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Última conexión: Ahora</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
            {user?.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={`Avatar de ${userName}`}
                width={80}
                height={80}
                className="w-full h-full rounded-full object-cover"
                priority={false}
                quality={85}
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}