// ===================================================================
// 📁 ARCHIVO: src/components/layout/Sidebar.tsx
// ===================================================================
/**
 * Componente de navegación lateral del dashboard
 * 
 * Características:
 * - Responsive (overlay en móvil, fijo en desktop)
 * - Enlaces de navegación principales
 * - Información del usuario
 * - Botón de cerrar sesión integrado
 * - Animaciones suaves
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  User as UserIcon, 
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react'

interface SidebarProps {
  user: User
  isOpen: boolean
  onClose: () => void
}

// Configuración de enlaces de navegación
const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Vista general'
  },
  {
    name: 'Agentes',
    href: '/dashboard/agents',
    icon: Sparkles,
    description: 'Catálogo de IA'
  },
  {
    name: 'Conversaciones',
    href: '/dashboard/conversations',
    icon: MessageSquare,
    description: 'Chats activos'
  },
  {
    name: 'Historial',
    href: '/dashboard/history',
    icon: History,
    description: 'Sesiones pasadas'
  },
  {
    name: 'Perfil',
    href: '/dashboard/profile',
    icon: UserIcon,
    description: 'Tu cuenta'
  },
  {
    name: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Preferencias'
  }
]

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      console.log('🚪 Cerrando sesión desde sidebar...')
      
      await supabase.auth.signOut()
      
      // Limpiar cualquier dato local adicional si es necesario
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
      
      // Redireccionar al login
      window.location.href = '/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Función para determinar si un enlace está activo
  const isActiveLink = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header del sidebar */}
        <div className="flex flex-col h-full">
          {/* Logo y título (solo visible en desktop) */}
          <div className="hidden lg:flex items-center px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-bold text-gray-900">InnoTech</h2>
                <p className="text-sm text-gray-500">Solutions</p>
              </div>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {(user?.user_metadata?.full_name || user?.email || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navegación principal */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose} // Cerrar sidebar en móvil al hacer clic
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon 
                    className={`
                      flex-shrink-0 h-5 w-5 mr-3
                      ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  <div className="flex-1">
                    <div className="text-sm">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Botón de cerrar sesión */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={`
                w-full group flex items-center px-3 py-2 text-sm font-medium
                rounded-lg transition-all duration-200
                ${isSigningOut
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }
              `}
            >
              <LogOut className="flex-shrink-0 h-5 w-5 mr-3" />
              {isSigningOut ? 'Cerrando...' : 'Cerrar Sesión'}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}