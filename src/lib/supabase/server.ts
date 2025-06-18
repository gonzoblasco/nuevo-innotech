// ===================================================================
// 📁 ARCHIVO: src/lib/supabase/server.ts
// ===================================================================
/**
 * Cliente de Supabase para el lado del servidor (Server Components, API Routes, Middleware)
 * 
 * Este cliente se utiliza en contextos de servidor donde necesitamos
 * verificar la autenticación sin acceso al localStorage del navegador.
 */
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
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // El middleware no puede establecer cookies, ignoramos el error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // El middleware no puede eliminar cookies, ignoramos el error
          }
        },
      },
    }
  )
}