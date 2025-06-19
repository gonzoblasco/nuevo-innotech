// ===================================================================
// 📁 ARCHIVO: src/components/chat/TypingIndicator.tsx
// ===================================================================
/**
 * Componente indicador de "escribiendo" para el chat
 * 
 * Muestra una animación visual cuando la IA está generando una respuesta.
 */
'use client'

import { Bot } from 'lucide-react'

interface TypingIndicatorProps {
  agentName?: string
}

export default function TypingIndicator({ agentName = 'Arquitecto de Decisiones' }: TypingIndicatorProps) {
  return (
    <div className="flex w-full mb-6 justify-start">
      <div className="flex gap-3 max-w-[85%] sm:max-w-[75%]">
        
        {/* Avatar del asistente */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </div>

        {/* Burbuja de typing */}
        <div className="flex flex-col items-start">
          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
            
            {/* Texto de estado */}
            <div className="text-sm text-gray-600 mb-2">
              {agentName} está analizando...
            </div>
            
            {/* Animación de puntos */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>

          {/* Texto de estado adicional */}
          <div className="text-xs text-gray-500 mt-1">
            Generando análisis estratégico...
          </div>
        </div>
      </div>
    </div>
  )
}