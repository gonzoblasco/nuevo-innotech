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

    const getInitialSession = async () => {
      try {
        console.log('📡 Obteniendo sesión inicial...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('📊 Estado de la sesión:', {
          session: session ? '✅ Encontrada' : '❌ No encontrada',
          user: session?.user ? '✅ Usuario presente' : '❌ Sin usuario',
          error: error ? `❌ ${error.message}` : '✅ Sin errores'
        })
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          
          // 🔍 DEBUG: Verificar localStorage
          if (typeof window !== 'undefined') {
            const keys = Object.keys(localStorage).filter(key => key.includes('supabase'))
            console.log('🗄️ Claves en localStorage:', keys.length > 0 ? keys : 'Ninguna')
          }
        }
      } catch (error) {
        console.error('💥 Error inesperado:', error)
      } finally {
        setIsLoading(false)
        console.log('🏁 Carga inicial completada')
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Evento de autenticación:', event, {
          session: session ? '✅ Con sesión' : '❌ Sin sesión',
          user: session?.user ? '✅ Con usuario' : '❌ Sin usuario'
        })
        
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        switch (event) {
          case 'SIGNED_IN':
            console.log('✅ Usuario autenticado:', session?.user?.email)
            // 🔍 DEBUG: Verificar qué se guardó
            if (typeof window !== 'undefined') {
              const keys = Object.keys(localStorage).filter(key => key.includes('supabase'))
              console.log('🗄️ Después del login, localStorage:', keys)
            }
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