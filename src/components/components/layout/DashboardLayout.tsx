// ===================================================================
// 📁 ARCHIVO: src/components/layout/DashboardLayout.tsx
// ===================================================================
/**
 * Componente principal del layout del dashboard
 * 
 * Características:
 * - Diseño mobile-first con sidebar responsive
 * - Integración con AuthProvider para datos del usuario
 * - Navegación adaptativa (hamburguesa en móvil, fija en desktop)
 * - Estados de carga y manejo de autenticación
 */
'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Mostrar loading si está verificando autenticación
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

  // Redirigir si no hay usuario (backup del middleware)
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil con hamburguesa */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-blue-600">InnoTech</h1>
          <p className="text-xs text-gray-500">Solutions</p>
        </div>
        
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Abrir menú"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          user={user} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Overlay para móvil */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}