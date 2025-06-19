// ===================================================================
// 📁 ARCHIVO: src/components/chat/ChatInterface.tsx
// ===================================================================
/**
 * Componente principal de la interfaz de chat
 * 
 * Orquesta toda la lógica del chat: mensajes, streaming, persistencia.
 * Es el cerebro de la conversación con el Arquitecto de Decisiones.
 */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react'

import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  token_count?: number
}

interface SessionData {
  id: string
  title: string
  agent_type: string
  status: string
  cost_cents: number
  created_at: string
}

interface ChatInterfaceProps {
  sessionId: string
}

export default function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const router = useRouter()
  
  // Estados principales
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string>('')
  const [streamingMessage, setStreamingMessage] = useState('')

  // Referencias
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Scroll automático al final
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Cargar datos iniciales de la sesión
  useEffect(() => {
    loadSessionData()
  }, [sessionId])

  // Scroll automático cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage, scrollToBottom])

  // Cargar datos de la sesión desde la API
  const loadSessionData = async () => {
    try {
      setIsLoading(true)
      setError('')

      console.log('📡 Cargando datos de sesión:', sessionId)

      const response = await fetch(`/api/sessions/${sessionId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sesión no encontrada')
        }
        throw new Error('Error cargando la sesión')
      }

      const data = await response.json()
      
      console.log('✅ Datos cargados:', {
        messageCount: data.messages?.length || 0,
        sessionTitle: data.session?.title
      })

      setSessionData(data.session)
      setMessages(data.messages || [])

    } catch (error) {
      console.error('❌ Error cargando sesión:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  // Enviar mensaje y manejar streaming
  const handleSendMessage = async (messageContent: string) => {
    if (isStreaming) return

    try {
      setIsStreaming(true)
      setError('')
      setStreamingMessage('')

      console.log('📤 Enviando mensaje:', messageContent.substring(0, 50) + '...')

      // Agregar mensaje del usuario inmediatamente
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: messageContent,
        created_at: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, userMessage])

      // Crear AbortController para cancelar si es necesario
      abortControllerRef.current = new AbortController()

      // Llamar a la API de streaming
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: messageContent
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No se recibió stream de respuesta')
      }

      // Procesar el stream de respuesta
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedResponse = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'chunk') {
                  accumulatedResponse += data.chunk
                  setStreamingMessage(accumulatedResponse)
                  
                } else if (data.type === 'end') {
                  console.log('✅ Stream completado:', {
                    tokens: data.tokenCount,
                    cost: data.cost
                  })
                  
                  // Agregar mensaje final del asistente
                  const assistantMessage: Message = {
                    id: `assistant-${Date.now()}`,
                    role: 'assistant',
                    content: accumulatedResponse,
                    created_at: new Date().toISOString(),
                    token_count: data.tokenCount
                  }
                  
                  setMessages(prev => [...prev, assistantMessage])
                  setStreamingMessage('')
                  
                } else if (data.type === 'error') {
                  throw new Error(data.error)
                }
                
              } catch (parseError) {
                console.warn('⚠️ Error parseando chunk SSE:', parseError)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

    } catch (error) {
      console.error('❌ Error enviando mensaje:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🛑 Stream cancelado por el usuario')
      } else {
        setError(error instanceof Error ? error.message : 'Error enviando mensaje')
      }
      
      setStreamingMessage('')
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  // Regenerar última respuesta
  const handleRegenerateResponse = async () => {
    if (messages.length < 2 || isStreaming) return

    // Encontrar el último mensaje del usuario
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')
    
    if (!lastUserMessage) return

    // Remover la última respuesta del asistente si existe
    const messagesWithoutLastAssistant = messages.filter((msg, index) => {
      if (msg.role === 'assistant' && index === messages.length - 1) {
        return false
      }
      return true
    })

    setMessages(messagesWithoutLastAssistant)
    
    // Re-enviar el último mensaje del usuario
    await handleSendMessage(lastUserMessage.content)
  }

  // Cancelar stream en progreso
  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
      setStreamingMessage('')
    }
  }

  // Volver al dashboard
  const handleGoBack = () => {
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando conversación...</p>
        </div>
      </div>
    )
  }

  if (error && !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error cargando la sesión
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Header del chat */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          {/* Información de la sesión */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="Volver al dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {sessionData?.title || 'Conversación'}
              </h1>
              <p className="text-sm text-gray-500">
                Arquitecto de Decisiones Estratégicas
              </p>
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center gap-2">
            
            {/* Costo actual */}
            {sessionData?.cost_cents !== undefined && (
              <div className="text-sm text-gray-500">
                ${(sessionData.cost_cents / 100).toFixed(3)}
              </div>
            )}
            
            {/* Regenerar respuesta */}
            {messages.length > 0 && !isStreaming && (
              <button
                onClick={handleRegenerateResponse}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                title="Regenerar última respuesta"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            
            {/* Cancelar stream */}
            {isStreaming && (
              <button
                onClick={handleCancelStream}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Mensaje de bienvenida si no hay mensajes */}
          {messages.length === 0 && !isStreaming && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                ¡Hola! Soy tu Arquitecto de Decisiones
              </h2>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                He analizado tu situación. Ahora puedes hacerme preguntas específicas, 
                pedirme que profundice en algún aspecto, o solicitar aclaraciones sobre 
                mi análisis inicial.
              </p>
            </div>
          )}

          {/* Lista de mensajes */}
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}

          {/* Mensaje en streaming */}
          {streamingMessage && (
            <div className="flex w-full mb-6 justify-start">
              <div className="flex gap-3 max-w-[85%] sm:max-w-[75%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center">
                  <span className="text-sm">🧠</span>
                </div>
                <div className="flex flex-col items-start">
                  <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm ring-2 ring-purple-200">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {streamingMessage}
                      <span className="animate-pulse">▊</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Generando respuesta...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Indicador de typing */}
          {isStreaming && !streamingMessage && (
            <TypingIndicator />
          )}

          {/* Error de conversación */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Referencia para scroll automático */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input de mensaje */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isStreaming}
        placeholder="Pregúntame sobre tu decisión, pide que profundice en algún aspecto..."
      />
    </div>
  )
}