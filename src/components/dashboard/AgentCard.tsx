// ===================================================================
// 📁 ARCHIVO: src/components/dashboard/AgentCard.tsx
// ===================================================================
'use client'

import { useState } from 'react'
import { Sparkles, MessageSquare, Brain, ArrowRight, Star } from 'lucide-react'

export default function AgentCard() {
  const [isHovered, setIsHovered] = useState(false)

  const agent = {
    name: 'Arquitecto de Decisiones Estratégicas',
    description: 'Tu experto en análisis estratégico y toma de decisiones empresariales',
    specialties: [
      'Análisis de mercado',
      'Estrategia competitiva',
      'Planificación empresarial',
      'Decisiones de inversión'
    ],
    rating: 4.9,
    sessionsCompleted: 1247,
    responseTime: '< 2 seg',
    lastUpdated: 'Actualizado hoy'
  }

  const handleStartSession = () => {
    console.log('Iniciando nueva sesión con:', agent.name)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold mb-1">
                {agent.name}
              </h3>
              <p className="text-blue-100 text-sm">
                Agente IA especializado
              </p>
            </div>
          </div>
          
          <div className="flex items-center bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
            <Star className="h-3 w-3 mr-1" />
            Destacado
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 mb-6 leading-relaxed">
          {agent.description}
        </p>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Especialidades:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {agent.specialties.map((specialty, index) => (
              <div 
                key={index}
                className="flex items-center text-sm text-gray-600"
              >
                <Sparkles className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                <span>{specialty}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-lg font-bold text-gray-900">{agent.rating}</span>
            </div>
            <p className="text-xs text-gray-600">Rating</p>
          </div>
          
          <div className="text-center border-l border-r border-gray-200">
            <div className="text-lg font-bold text-gray-900 mb-1">
              {agent.sessionsCompleted.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Sesiones</p>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 mb-1">
              {agent.responseTime}
            </div>
            <p className="text-xs text-gray-600">Respuesta</p>
          </div>
        </div>

        <button
          onClick={handleStartSession}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center gap-3"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Comenzar Nueva Sesión</span>
          <ArrowRight 
            className={`h-5 w-5 transition-transform duration-300 ${
              isHovered ? 'translate-x-1' : ''
            }`} 
          />
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          {agent.lastUpdated} • Disponible 24/7
        </p>
      </div>
    </div>
  )
}