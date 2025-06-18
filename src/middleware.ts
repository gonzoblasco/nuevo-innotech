// ===================================================================
// 📁 ARCHIVO: src/middleware.ts
// ===================================================================
/**
 * Middleware de Next.js para protección de rutas
 * 
 * Este middleware:
 * - Protege las rutas del dashboard que requieren autenticación
 * - Redirige usuarios no autenticados al login
 * - Permite acceso a usuarios autenticados
 * - Maneja las redirecciones de forma eficiente
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Crear cliente de Supabase para el servidor
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
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
        remove(name: string, options: any) {
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

  // Verificar la sesión del usuario
  const { data: { user }, error } = await supabase.auth.getUser()

  // URL actual y rutas importantes
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Definir rutas protegidas (que requieren autenticación)
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Definir rutas de autenticación
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(pathname)

  // Lógica de redirección
  if (isProtectedRoute && (!user || error)) {
    // Usuario no autenticado intentando acceder a ruta protegida
    console.log('Redirigiendo a login - Usuario no autenticado')
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname) // Guardar URL de destino
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user && !error) {
    // Usuario autenticado intentando acceder a páginas de auth
    console.log('Redirigiendo a dashboard - Usuario ya autenticado')
    
    // Verificar si hay una URL de redirección guardada
    const redirectTo = url.searchParams.get('redirect')
    if (redirectTo && redirectTo.startsWith('/')) {
      url.pathname = redirectTo
      url.searchParams.delete('redirect')
    } else {
      url.pathname = '/dashboard'
    }
    
    return NextResponse.redirect(url)
  }

  // Si llegamos aquí, permitir acceso normal
  return response
}

// Configuración del matcher para especificar qué rutas debe procesar el middleware
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de solicitud excepto las que comienzan con:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (archivo favicon)
     * - archivos públicos (imágenes, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}