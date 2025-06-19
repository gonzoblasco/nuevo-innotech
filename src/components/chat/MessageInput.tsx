// ===================================================================
// 📁 ARCHIVO: src/components/chat/MessageInput.tsx
// ===================================================================
/**
 * Componente de entrada de mensajes para el chat
 * 
 * Características:
 * - Textarea auto-expandible
 * - Envío con Enter (Shift+Enter para nueva línea)
 * - Estados de loading y disabled
 * - Validación de longitud de mensaje
 * - Diseño mobile-first
 */
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function MessageInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Escribe tu mensaje aquí..."
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize del textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [message])

  // Focus automático al cargar
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [disabled])

  // Enviar mensaje
  const handleSubmit = () => {
    const trimmedMessage = message.trim()
    
    if (!trimmedMessage || disabled) return
    
    if (trimmedMessage.length > 2000) {
      alert('El mensaje es demasiado largo. Máximo 2000 caracteres.')
      return
    }

    onSendMessage(trimmedMessage)
    setMessage('')
    
    // Reset altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  // Manejar teclas
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isComposing) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Validar longitud del mensaje
  const messageLength = message.length
  const isOverLimit = messageLength > 2000
  const isNearLimit = messageLength > 1800

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Contador de caracteres si está cerca del límite */}
        {isNearLimit && (
          <div className={`text-xs mb-2 ${isOverLimit ? 'text-red-500' : 'text-yellow-600'}`}>
            {messageLength}/2000 caracteres
            {isOverLimit && ' - Mensaje demasiado largo'}
          </div>
        )}

        <div className="flex gap-3 items-end">
          
          {/* Textarea de entrada */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={disabled ? 'Esperando respuesta...' : placeholder}
              disabled={disabled}
              rows={1}
              className={`
                w-full px-4 py-3 rounded-xl border resize-none transition-colors
                ${disabled 
                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
                  : isOverLimit
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                placeholder:text-gray-400
              `}
              style={{ 
                minHeight: '48px',
                maxHeight: '120px'
              }}
            />
            
            {/* Hint de teclas */}
            {!disabled && (
              <div className="absolute bottom-1 right-3 text-xs text-gray-400 pointer-events-none">
                Enter para enviar • Shift+Enter para nueva línea
              </div>
            )}
          </div>

          {/* Botón de envío */}
          <button
            onClick={handleSubmit}
            disabled={disabled || !message.trim() || isOverLimit}
            className={`
              flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
              ${disabled || !message.trim() || isOverLimit
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500'
              }
            `}
            title={disabled ? 'Esperando respuesta...' : 'Enviar mensaje'}
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Indicadores adicionales */}
        {!disabled && message.trim() && (
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
            <span>💡 Tip: Sé específico para obtener mejores recomendaciones</span>
          </div>
        )}
      </div>
    </div>
  )
}