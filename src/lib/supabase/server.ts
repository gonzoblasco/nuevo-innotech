import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)?.value
          return cookie
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // El middleware puede no poder establecer cookies
            console.warn('No se pudo establecer cookie:', name)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // El middleware puede no poder eliminar cookies
            console.warn('No se pudo eliminar cookie:', name)
          }
        },
      },
      auth: {
        // ✅ CONFIGURACIÓN ADICIONAL PARA MEJOR AUTH
        persistSession: true,
        detectSessionInUrl: false, // No detectar en servidor
        flowType: 'implicit'
      }
    }
  )
}