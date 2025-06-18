// ===================================================================
// 📁 ARCHIVO: src/app/(auth)/layout.tsx
// ===================================================================
/**
 * Layout específico para las páginas de autenticación
 * 
 * Características:
 * - Diseño centrado y responsive
 * - Optimizado para móviles primero
 * - Fondo y estilizado específico para auth
 */
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticación | InnoTech Solutions',
  description: 'Accede a tu catálogo de agentes conversacionales especializados'
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header con logo */}
      <header className="py-6 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold text-blue-900">
            InnoTech Solutions
          </h2>
          <p className="text-sm text-blue-700 mt-1">
            Netflix de Agentes Conversacionales
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Contenedor del formulario con fondo blanco */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-blue-700">
          © 2025 InnoTech Solutions - Democratizando el acceso a expertise de calidad
        </p>
      </footer>
    </div>
  )
}