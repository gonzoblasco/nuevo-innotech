'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 AuthProvider iniciando...')

    // Función para obtener la sesión inicial
    const getInitialSession = async () => {
      try {
        console.log('📡 Obteniendo sesión inicial...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error)
        } else {
          console.log('✅ Sesión obtenida:', session ? 'Usuario logueado' : 'Sin sesión')
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('💥 Error inesperado:', error)
      } finally {
        setIsLoading(false)
        console.log('🏁 Carga inicial completada')
      }
    }

    // Obtener sesión inicial
    getInitialSession()

    // Escuchar cambios de autenticación
    console.log('👂 Configurando listener de autenticación...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Evento de autenticación:', event, session ? 'Con sesión' : 'Sin sesión')
        
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        // Log específico por evento
        switch (event) {
          case 'SIGNED_IN':
            console.log('✅ Usuario autenticado:', session?.user?.email)
            break
          case 'SIGNED_OUT':
            console.log('🚪 Usuario cerró sesión')
            break
          case 'TOKEN_REFRESHED':
            console.log('🔄 Token renovado')
            break
        }
      }
    )

    // Cleanup
    return () => {
      console.log('🧹 Limpiando listener...')
      subscription.unsubscribe()
    }
  }, [])

  const contextValue: AuthContextType = {
    user,
    session,
    isLoading
  }

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}