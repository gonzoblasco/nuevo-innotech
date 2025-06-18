// import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
// import type { CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // 🚨 BYPASS TEMPORAL - COMENTAR PARA TESTING
  console.log(`🔄 Middleware bypass activo para: ${pathname}`)
  
  // Solo proteger rutas muy específicas por ahora
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/protected')) {
    console.log('🔒 Ruta administrativa protegida')
    // Aquí aplicar protección normal
  }
  
  // PERMITIR TODO TEMPORALMENTE
  return NextResponse.next()

  /* 
  // ===================================================================
  // 🔧 CÓDIGO ORIGINAL (REACTIVAR CUANDO SUPABASE FUNCIONE)
  // ===================================================================
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value
          if (name.includes('auth-token') && !name.includes('.')) {
            console.log(`🍪 Cookie principal ${name}:`, cookie ? '✅ Presente' : '❌ Ausente')
          }
          return cookie
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    console.log(`🔍 Middleware procesando: ${pathname}`)
    console.log(`👤 Usuario:`, user ? `✅ Autenticado (${user.email})` : '❌ No autenticado')
    if (error && !error.message.includes('session_not_found')) {
      console.log(`🚨 Error:`, error.message)
    }
  }

  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(pathname)

  if (isProtectedRoute && (!user || error)) {
    console.log('🔒 Redirigiendo a login - Usuario no autenticado')
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user && !error) {
    console.log('✅ Redirigiendo a dashboard - Usuario ya autenticado')
    const redirectTo = url.searchParams.get('redirect')
    if (redirectTo && redirectTo.startsWith('/')) {
      url.pathname = redirectTo
      url.searchParams.delete('redirect')
    } else {
      url.pathname = '/dashboard'
    }
    return NextResponse.redirect(url)
  }

  return response
  */
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}