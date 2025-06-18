// ===================================================================
// 📁 ARCHIVO: src/components/forms/StepIndicator.tsx
// ===================================================================
/**
 * Componente indicador de progreso para formularios multi-step
 * 
 * Muestra visualmente en qué paso está el usuario y cuáles ha completado.
 * Diseño mobile-first y totalmente responsive.
 */
'use client'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles?: string[]
}

export default function StepIndicator({ 
  currentStep, 
  totalSteps, 
  stepTitles = [] 
}: StepIndicatorProps) {
  // Generar array de pasos
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1)

  return (
    <div className="w-full mb-8">
      {/* Progress bar completo */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Paso {currentStep} de {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% completado</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Indicadores de paso individual (hidden en móvil si hay títulos largos) */}
      <div className="flex justify-between items-center">
        {steps.map((step) => {
          const isCompleted = step < currentStep
          const isCurrent = step === currentStep
          const isUpcoming = step > currentStep
          
          return (
            <div 
              key={step}
              className="flex flex-col items-center flex-1"
            >
              {/* Círculo del paso */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                transition-all duration-300 mb-2
                ${isCompleted 
                  ? 'bg-green-500 text-white scale-110' 
                  : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-110'
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>

              {/* Título del paso (solo en pantallas más grandes) */}
              {stepTitles[step - 1] && (
                <span className={`
                  text-xs text-center leading-tight hidden sm:block max-w-20
                  ${isCurrent ? 'text-blue-700 font-medium' : 'text-gray-500'}
                `}>
                  {stepTitles[step - 1]}
                </span>
              )}

              {/* Línea conectora (excepto último paso) */}
              {step < totalSteps && (
                <div className={`
                  absolute top-4 left-1/2 w-full h-0.5 -z-10 transition-colors duration-300
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `} 
                style={{ 
                  marginLeft: '16px',
                  width: 'calc(100% - 32px)'
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}