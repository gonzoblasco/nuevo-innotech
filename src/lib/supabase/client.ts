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
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  }
})

console.log('✅ Cliente Supabase configurado')