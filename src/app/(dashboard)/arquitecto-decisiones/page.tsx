// ===================================================================
// 📁 ARCHIVO: src/app/(dashboard)/arquitecto-decisiones/page.tsx
// ===================================================================
/**
 * Página principal del Arquitecto de Decisiones Estratégicas
 * 
 * Esta página renderiza el formulario multi-step y está protegida
 * por el layout del dashboard (autenticación requerida).
 */
import { Metadata } from 'next'
import ArquitectoDecisionesForm from '@/components/forms/ArquitectoDecisionesForm'

export const metadata: Metadata = {
  title: 'Arquitecto de Decisiones | InnoTech Solutions',
  description: 'Toma decisiones estratégicas informadas con ayuda de IA especializada'
}

export default function ArquitectoDecisionesPage() {
  return (
    <div className="space-y-8">
      {/* Header de la página */}
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Arquitecto de Decisiones Estratégicas
        </h1>
        
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Tu experto en análisis estratégico y toma de decisiones empresariales. 
          Completa el formulario paso a paso para recibir un análisis profundo 
          y recomendaciones accionables para tu situación específica.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Análisis matricial completo
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Recomendaciones personalizadas
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Plan de implementación
          </div>
        </div>
      </div>

      {/* Formulario principal */}
      <ArquitectoDecisionesForm />

      {/* Footer informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          💡 ¿Cómo funciona el Arquitecto de Decisiones?
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Nuestro agente especializado utiliza frameworks probados de decisión estratégica 
          para analizar tu situación, evaluar alternativas contra criterios ponderados, 
          y proporcionarte un plan de acción claro y fundamentado.
        </p>
      </div>
    </div>
  )
}