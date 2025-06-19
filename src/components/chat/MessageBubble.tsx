// ===================================================================
// 📁 ARCHIVO: src/components/chat/MessageBubble.tsx
// ===================================================================
/**
 * Componente para mostrar burbujas de mensajes individuales
 * 
 * Características:
 * - Diferenciación visual entre usuario y asistente
 * - Markdown rendering para respuestas formateadas
 * - Timestamps y estados de mensaje
 * - Diseño mobile-first responsive
 */
'use client'

import { useState } from 'react'
import { Copy, Check, User, Bot } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  token_count?: number
}

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
}

export default function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  // Función para copiar contenido al portapapeles
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copiando al portapapeles:', error)
    }
  }

  // Formatear timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Renderizar contenido con saltos de línea preservados
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser 
            ? 'bg-blue-600 text-white' 
            : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
          }
        `}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Contenido del mensaje */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          
          {/* Burbuja principal */}
          <div className={`
            relative px-4 py-3 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-blue-600 text-white rounded-br-md' 
              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
            }
            ${isLatest && !isUser ? 'ring-2 ring-purple-200' : ''}
          `}>
            
            {/* Contenido del mensaje */}
            <div className={`
              text-sm leading-relaxed whitespace-pre-wrap
              ${isUser ? 'text-white' : 'text-gray-900'}
            `}>
              {renderContent(message.content)}
            </div>

            {/* Botón de copiar (solo para mensajes del asistente) */}
            {!isUser && (
              <button
                onClick={handleCopy}
                className={`
                  absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 
                  flex items-center justify-center transition-all duration-200
                  ${copied ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:text-gray-700'}
                `}
                title={copied ? 'Copiado!' : 'Copiar mensaje'}
              >
                {copied ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          {/* Información adicional */}
          <div className={`
            flex items-center gap-2 mt-1 text-xs text-gray-500
            ${isUser ? 'flex-row-reverse' : 'flex-row'}
          `}>
            <span>{formatTime(message.created_at)}</span>
            
            {/* Mostrar conteo de tokens para mensajes del asistente */}
            {!isUser && message.token_count && (
              <>
                <span>•</span>
                <span>{message.token_count} tokens</span>
              </>
            )}
            
            {/* Indicador de mensaje más reciente */}
            {isLatest && !isUser && (
              <>
                <span>•</span>
                <span className="text-purple-600 font-medium">Más reciente</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}