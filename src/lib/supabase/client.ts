// ===================================================================
// 📁 ARCHIVO: src/lib/supabase/client.ts
// ===================================================================
/**
 * Cliente de Supabase para el lado del navegador (Client Components)
 * 
 * Este cliente se utiliza en los componentes React que se ejecutan en el navegador.
 * Incluye la configuración de autenticación automática y manejo de sesiones.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('🔧 Configurando cliente Supabase...')
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ Falta')
console.log('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ Falta')

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Variables de entorno de Supabase no configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // CAMBIO CRÍTICO: Configuración más agresiva para persistir sesión
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    // NUEVO: Configuración específica para cookies
    storage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key)
        }
        return null
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value)
        }
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key)
        }
      }
    }
  }
})

console.log('✅ Cliente Supabase configurado')
