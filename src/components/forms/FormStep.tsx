// ===================================================================
// 📁 ARCHIVO: src/components/forms/FormStep.tsx
// ===================================================================
/**
 * Componente wrapper genérico para cada paso del formulario
 * 
 * Proporciona estructura consistente y manejo de visibilidad
 * para todos los pasos del formulario multi-step.
 */
'use client'

interface FormStepProps {
  isActive: boolean
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function FormStep({ 
  isActive, 
  title, 
  subtitle, 
  children 
}: FormStepProps) {
  if (!isActive) return null

  return (
    <div className="space-y-6">
      {/* Header del paso */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Contenido del paso */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}