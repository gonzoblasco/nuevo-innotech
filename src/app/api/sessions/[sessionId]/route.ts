import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // ✅ Await params (Next.js 15)
    const { sessionId } = await params
    
    console.log('🔍 API Sessions GET - SessionId:', sessionId.substring(0, 8) + '...')
    
    // Crear cliente de Supabase
    const supabase = await createClient()
    
    // ✅ MEJOR MANEJO DE AUTENTICACIÓN
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('👤 Usuario en API:', user ? `✅ ${user.email}` : '❌ No autenticado')
    console.log('🔑 Error auth:', authError ? authError.message : 'Sin errores')
    
    if (authError) {
      console.error('❌ Error de autenticación:', authError)
      return NextResponse.json(
        { error: 'Error de autenticación', details: authError.message },
        { status: 401 }
      )
    }
    
    if (!user) {
      console.error('❌ Usuario no encontrado')
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // Obtener detalles de la sesión
    const { data: session, error: sessionError } = await supabase
      .from('agent_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError)
      return NextResponse.json(
        { error: 'Error obteniendo sesión', details: sessionError.message },
        { status: sessionError.code === 'PGRST116' ? 404 : 500 }
      )
    }

    if (!session) {
      console.error('❌ Sesión no encontrada')
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    console.log('✅ Sesión encontrada:', session.title)

    // Obtener mensajes de la sesión
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('❌ Error obteniendo mensajes:', messagesError)
      // No es crítico, continuamos sin mensajes
    }

    console.log('📨 Mensajes cargados:', messages?.length || 0)

    return NextResponse.json({
      session,
      messages: messages || []
    })

  } catch (error) {
    console.error('💥 Error general en GET session:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // ✅ Await params (Next.js 15)
    const { sessionId } = await params
    const updates = await request.json()
    
    // Crear cliente de Supabase
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Actualizar sesión
    const { data: session, error: updateError } = await supabase
      .from('agent_sessions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Error actualizando sesión:', updateError)
      return NextResponse.json(
        { error: 'Error actualizando sesión' },
        { status: 500 }
      )
    }

    return NextResponse.json({ session })

  } catch (error) {
    console.error('💥 Error en PATCH session:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}