import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  createChatCompletion, 
  buildMessagesArray, 
  estimateTokenCount, 
  calculateCost 
} from '@/lib/openai/chat'

// Configurar el runtime de Edge para mejor performance en streaming
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    console.log('📨 API Chat Stream: Nueva solicitud recibida')
    
    // Parsear el cuerpo de la solicitud
    const { sessionId, message } = await request.json()
    
    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId y message son requeridos' },
        { status: 400 }
      )
    }

    console.log('📋 Datos recibidos:', {
      sessionId: sessionId.substring(0, 8) + '...',
      messageLength: message.length
    })

    // Crear cliente de Supabase para el servidor
    // ✅ MEJOR MANEJO DE AUTENTICACIÓN
    const supabase = await createClient()
    
    // Obtener headers de autorización
    const authHeader = request.headers.get('authorization')
    console.log('🔑 Auth header presente:', authHeader ? '✅ Sí' : '❌ No')
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('👤 Usuario en Chat API:', user ? `✅ ${user.email}` : '❌ No autenticado')
    console.log('🔑 Auth error:', authError ? authError.message : 'Sin errores')
    
    if (authError) {
      console.error('❌ Error de autenticación en chat:', authError)
      return NextResponse.json(
        { error: 'Error de autenticación', details: authError.message },
        { status: 401 }
      )
    }
    
    if (!user) {
      console.error('❌ Usuario no encontrado en chat')
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // Obtener la sesión y verificar que pertenece al usuario
    const { data: session, error: sessionError } = await supabase
      .from('agent_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      console.error('❌ Error obteniendo sesión:', sessionError)
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    // Obtener historial de mensajes de la sesión
    const { data: chatHistory, error: historyError } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (historyError) {
      console.error('❌ Error obteniendo historial:', historyError)
      return NextResponse.json(
        { error: 'Error obteniendo historial' },
        { status: 500 }
      )
    }

    console.log('📚 Historial cargado:', {
      mensajesPrevios: chatHistory?.length || 0
    })

    // Construir array de mensajes para OpenAI
    const systemPrompt = session.prompt || 'Eres un asistente experto que ayuda con decisiones estratégicas.'
    const messages = buildMessagesArray(
      systemPrompt,
      chatHistory || [],
      message
    )

    // Calcular tokens de entrada para pricing
    const inputTokens = messages.reduce(
      (total, msg) => total + estimateTokenCount(msg.content), 
      0
    )

    console.log('🧮 Tokens de entrada estimados:', inputTokens)

    // Guardar mensaje del usuario
    const { error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: message,
        token_count: estimateTokenCount(message),
        cost_cents: 0 // Los mensajes del usuario no tienen costo
      })

    if (userMessageError) {
      console.error('❌ Error guardando mensaje usuario:', userMessageError)
      return NextResponse.json(
        { error: 'Error guardando mensaje' },
        { status: 500 }
      )
    }

    // Crear stream de OpenAI
    const chatStream = await createChatCompletion(messages)
    
    // Crear ReadableStream para la respuesta
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        let assistantResponse = ''
        
        try {
          // Procesar cada chunk del stream de OpenAI
          for await (const chunk of chatStream) {
            assistantResponse += chunk
            
            // Enviar chunk al cliente
            const data = JSON.stringify({ 
              chunk, 
              type: 'chunk' 
            })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          // Calcular tokens y costo de la respuesta
          const outputTokens = estimateTokenCount(assistantResponse)
          const totalCost = calculateCost(inputTokens, outputTokens)

          console.log('💰 Cálculo de costos:', {
            inputTokens,
            outputTokens,
            totalCostCents: totalCost
          })

          // Guardar respuesta del asistente en Supabase
          const { error: assistantMessageError } = await supabase
            .from('chat_messages')
            .insert({
              session_id: sessionId,
              role: 'assistant',
              content: assistantResponse,
              token_count: outputTokens,
              cost_cents: totalCost
            })

          if (assistantMessageError) {
            console.error('❌ Error guardando respuesta asistente:', assistantMessageError)
          }

          // Actualizar costo total de la sesión
          const { error: updateSessionError } = await supabase
            .from('agent_sessions')
            .update({
              cost_cents: (session.cost_cents || 0) + totalCost,
              updated_at: new Date().toISOString()
            })
            .eq('id', sessionId)

          if (updateSessionError) {
            console.error('❌ Error actualizando costo sesión:', updateSessionError)
          }

          // Enviar mensaje de finalización
          const endData = JSON.stringify({ 
            type: 'end',
            tokenCount: outputTokens,
            cost: totalCost
          })
          controller.enqueue(encoder.encode(`data: ${endData}\n\n`))

          console.log('✅ Stream completado exitosamente')

        } catch (error) {
          console.error('❌ Error en stream:', error)
          
          const errorData = JSON.stringify({ 
            type: 'error',
            error: 'Error generando respuesta'
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
        } finally {
          controller.close()
        }
      }
    })

    // Retornar respuesta con headers SSE
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('💥 Error general en API Chat:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Manejar OPTIONS para CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}