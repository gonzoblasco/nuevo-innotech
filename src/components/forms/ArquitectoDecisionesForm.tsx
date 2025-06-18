// ===================================================================
// 📁 ARCHIVO: src/components/forms/ArquitectoDecisionesForm.tsx
// ===================================================================
/**
 * Formulario principal multi-step del Arquitecto de Decisiones
 * 
 * Orquesta los 6 pasos del formulario con validación completa,
 * campos dinámicos y integración con Supabase para guardar sesiones.
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Minus, ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react'

import { supabase } from '@/lib/supabase/client'
import { 
  arquitectoDecisionesSchema,
  type ArquitectoDecisionesFormData 
} from '@/lib/validations/forms'
import { generateArquitectoDecisionesPrompt, getPromptMetadata } from '@/lib/prompts/arquitecto-decisiones'
import StepIndicator from './StepIndicator'
import FormStep from './FormStep'

// Configuración de los pasos del formulario
const PASOS_CONFIG = [
  {
    titulo: 'Contexto de la Decisión',
    subtitulo: 'Describe detalladamente la situación que requiere una decisión estratégica'
  },
  {
    titulo: 'Timeline de Decisión',
    subtitulo: 'Especifica cuándo necesitas tomar esta decisión'
  },
  {
    titulo: 'Alternativas Disponibles',
    subtitulo: 'Lista las opciones que estás considerando (mínimo 2, máximo 6)'
  },
  {
    titulo: 'Criterios de Evaluación',
    subtitulo: 'Define los factores más importantes para evaluar las alternativas'
  },
  {
    titulo: 'Información Faltante',
    subtitulo: 'Especifica qué datos adicionales necesitas para decidir mejor'
  },
  {
    titulo: 'Contexto Personal',
    subtitulo: 'Agrega cualquier información personal relevante (opcional)'
  }
]

const TIMELINE_OPTIONS = [
  { value: 'urgente', label: 'Urgente (decisión inmediata)', description: 'Necesito decidir hoy o mañana' },
  { value: '2-4-semanas', label: '2-4 semanas', description: 'Tengo algunas semanas para analizar' },
  { value: '1-2-meses', label: '1-2 meses', description: 'Puedo tomarme tiempo para investigar' },
  { value: 'flexible', label: 'Timeline flexible', description: 'No hay presión de tiempo específica' }
]

export default function ArquitectoDecisionesForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')

  // Configuración de react-hook-form con validación Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    watch,
    trigger,
    getValues
  } = useForm<ArquitectoDecisionesFormData>({
    resolver: zodResolver(arquitectoDecisionesSchema),
    mode: 'onChange',
    defaultValues: {
      contextoDecision: '',
      timeline: undefined,
      alternativas: [
        { id: '1', nombre: '', descripcion: '' },
        { id: '2', nombre: '', descripcion: '' }
      ],
      criterios: [
        { id: '1', nombre: '', peso: 5 },
        { id: '2', nombre: '', peso: 5 },
        { id: '3', nombre: '', peso: 5 }
      ],
      informacionFaltante: '',
      contextoPersonal: ''
    }
  })

  // Configuración de campos dinámicos
  const { 
    fields: alternativasFields, 
    append: appendAlternativa, 
    remove: removeAlternativa 
  } = useFieldArray({
    control,
    name: 'alternativas'
  })

  const { 
    fields: criteriosFields, 
    append: appendCriterio, 
    remove: removeCriterio 
  } = useFieldArray({
    control,
    name: 'criterios'
  })

  // Funciones para manejar campos dinámicos
  const handleAddAlternativa = () => {
    if (alternativasFields.length < 6) {
      appendAlternativa({ 
        id: Date.now().toString(), 
        nombre: '', 
        descripcion: '' 
      })
    }
  }

  const handleRemoveAlternativa = (index: number) => {
    if (alternativasFields.length > 2) {
      removeAlternativa(index)
    }
  }

  const handleAddCriterio = () => {
    if (criteriosFields.length < 8) {
      appendCriterio({ 
        id: Date.now().toString(), 
        nombre: '', 
        peso: 5 
      })
    }
  }

  const handleRemoveCriterio = (index: number) => {
    if (criteriosFields.length > 3) {
      removeCriterio(index)
    }
  }

  // Validación específica por paso
  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsToValidate: Record<number, (keyof ArquitectoDecisionesFormData)[]> = {
      1: ['contextoDecision'],
      2: ['timeline'],
      3: ['alternativas'],
      4: ['criterios'],
      5: ['informacionFaltante'],
      6: ['contextoPersonal']
    }

    const fields = fieldsToValidate[currentStep]
    if (fields) {
      return await trigger(fields)
    }
    return true
  }

  // Navegación entre pasos
  const handleNextStep = async () => {
    const isStepValid = await validateCurrentStep()
    if (isStepValid && currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Envío final del formulario
  const onSubmit = async (data: ArquitectoDecisionesFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError('')

      console.log('📤 Enviando formulario del Arquitecto de Decisiones...')

      // Generar el prompt especializado
      const prompt = generateArquitectoDecisionesPrompt(data)
      const metadata = getPromptMetadata(data)

      console.log('🤖 Prompt generado:', prompt.substring(0, 200) + '...')

      // Obtener usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        throw new Error('Usuario no autenticado')
      }

      // Crear nueva sesión en Supabase
      const sessionData = {
        user_id: user.id,
        agent_type: 'arquitecto-decisiones',
        title: `Decisión: ${data.contextoDecision.substring(0, 50)}...`,
        prompt: prompt,
        form_data: data,
        metadata: metadata,
        status: 'created',
        created_at: new Date().toISOString()
      }

      const { data: session, error: sessionError } = await supabase
        .from('agent_sessions')
        .insert([sessionData])
        .select()
        .single()

      if (sessionError) {
        console.error('❌ Error creando sesión:', sessionError)
        throw new Error(`Error al guardar la sesión: ${sessionError.message}`)
      }

      console.log('✅ Sesión creada exitosamente:', session.id)

      // Redirigir a la interfaz de chat (placeholder por ahora)
      // TODO: Reemplazar con la ruta real del chat en Sprint 4
      alert(`¡Formulario completado! Sesión ID: ${session.id}\n\nEn el Sprint 4 implementaremos la interfaz de chat.`)
      router.push('/dashboard')

    } catch (error) {
      console.error('💥 Error en envío:', error)
      setSubmitError(error instanceof Error ? error.message : 'Error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Indicador de progreso */}
      <StepIndicator 
        currentStep={currentStep} 
        totalSteps={6}
        stepTitles={['Contexto', 'Timeline', 'Alternativas', 'Criterios', 'Info', 'Personal']}
      />

      {/* Formulario principal */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
          
          {/* PASO 1: Contexto de la Decisión */}
          <FormStep
            isActive={currentStep === 1}
            title={PASOS_CONFIG[0].titulo}
            subtitle={PASOS_CONFIG[0].subtitulo}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Describe la situación que requiere una decisión estratégica
              </label>
              <textarea
                {...register('contextoDecision')}
                rows={6}
                placeholder="Ejemplo: Necesito decidir si expandir mi negocio a una nueva ciudad. Actualmente tengo un restaurante exitoso en Buenos Aires y estoy considerando abrir una segunda ubicación..."
                className={`
                  w-full px-4 py-3 rounded-lg border resize-none
                  ${errors.contextoDecision 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                `}
              />
              {errors.contextoDecision && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.contextoDecision.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {watch('contextoDecision')?.length || 0}/1000 caracteres
              </p>
            </div>
          </FormStep>

          {/* PASO 2: Timeline */}
          <FormStep
            isActive={currentStep === 2}
            title={PASOS_CONFIG[1].titulo}
            subtitle={PASOS_CONFIG[1].subtitulo}
          >
            <div className="space-y-4">
              {TIMELINE_OPTIONS.map((option) => (
                <label 
                  key={option.value}
                  className={`
                    block p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${watch('timeline') === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <input
                      {...register('timeline')}
                      type="radio"
                      value={option.value}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
              {errors.timeline && (
                <p className="text-sm text-red-600">
                  {errors.timeline.message}
                </p>
              )}
            </div>
          </FormStep>

          {/* PASO 3: Alternativas */}
          <FormStep
            isActive={currentStep === 3}
            title={PASOS_CONFIG[2].titulo}
            subtitle={PASOS_CONFIG[2].subtitulo}
          >
            <div className="space-y-6">
              {alternativasFields.map((field, index) => (
                <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      Alternativa {index + 1}
                    </h4>
                    {alternativasFields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAlternativa(index)}
                        className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre de la alternativa
                      </label>
                      <input
                        {...register(`alternativas.${index}.nombre`)}
                        type="text"
                        placeholder="Ej: Expandir a Córdoba"
                        className={`
                          w-full px-3 py-2 rounded-lg border text-sm
                          ${errors.alternativas?.[index]?.nombre
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }
                          focus:outline-none focus:ring-2 focus:ring-opacity-50
                        `}
                      />
                      {errors.alternativas?.[index]?.nombre && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.alternativas[index]?.nombre?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descripción breve
                      </label>
                      <textarea
                        {...register(`alternativas.${index}.descripcion`)}
                        rows={2}
                        placeholder="Describe brevemente esta alternativa..."
                        className={`
                          w-full px-3 py-2 rounded-lg border text-sm resize-none
                          ${errors.alternativas?.[index]?.descripcion
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }
                          focus:outline-none focus:ring-2 focus:ring-opacity-50
                        `}
                      />
                      {errors.alternativas?.[index]?.descripcion && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.alternativas[index]?.descripcion?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón para agregar alternativa */}
              {alternativasFields.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddAlternativa}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar alternativa ({alternativasFields.length}/6)
                </button>
              )}

              {errors.alternativas?.root && (
                <p className="text-sm text-red-600">
                  {errors.alternativas.root.message}
                </p>
              )}
            </div>
          </FormStep>

          {/* PASO 4: Criterios de Evaluación */}
          <FormStep
            isActive={currentStep === 4}
            title={PASOS_CONFIG[3].titulo}
            subtitle={PASOS_CONFIG[3].subtitulo}
          >
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Peso de criterios:</strong> Asigna un peso del 1 al 10 según la importancia de cada criterio. 
                  Los criterios con mayor peso tendrán más influencia en la recomendación final.
                </p>
              </div>

              {criteriosFields.map((field, index) => (
                <div key={field.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      Criterio {index + 1}
                    </h4>
                    {criteriosFields.length > 3 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterio(index)}
                        className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre del criterio
                      </label>
                      <input
                        {...register(`criterios.${index}.nombre`)}
                        type="text"
                        placeholder="Ej: Rentabilidad esperada"
                        className={`
                          w-full px-3 py-2 rounded-lg border text-sm
                          ${errors.criterios?.[index]?.nombre
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }
                          focus:outline-none focus:ring-2 focus:ring-opacity-50
                        `}
                      />
                      {errors.criterios?.[index]?.nombre && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.criterios[index]?.nombre?.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Peso (1-10)
                      </label>
                      <select
                        {...register(`criterios.${index}.peso`, { valueAsNumber: true })}
                        className={`
                          w-full px-3 py-2 rounded-lg border text-sm
                          ${errors.criterios?.[index]?.peso
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }
                          focus:outline-none focus:ring-2 focus:ring-opacity-50
                        `}
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>
                            {num} {num <= 3 ? '(bajo)' : num <= 6 ? '(medio)' : '(alto)'}
                          </option>
                        ))}
                      </select>
                      {errors.criterios?.[index]?.peso && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.criterios[index]?.peso?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Botón para agregar criterio */}
              {criteriosFields.length < 8 && (
                <button
                  type="button"
                  onClick={handleAddCriterio}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar criterio ({criteriosFields.length}/8)
                </button>
              )}

              {errors.criterios?.root && (
                <p className="text-sm text-red-600">
                  {errors.criterios.root.message}
                </p>
              )}
            </div>
          </FormStep>

          {/* PASO 5: Información Faltante */}
          <FormStep
            isActive={currentStep === 5}
            title={PASOS_CONFIG[4].titulo}
            subtitle={PASOS_CONFIG[4].subtitulo}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ¿Qué información adicional necesitas para tomar una mejor decisión?
              </label>
              <textarea
                {...register('informacionFaltante')}
                rows={5}
                placeholder="Ejemplo: Necesito conocer los costos específicos de alquiler en Córdoba, estudios de mercado de la zona, competencia directa, y una proyección realista de demanda..."
                className={`
                  w-full px-4 py-3 rounded-lg border resize-none
                  ${errors.informacionFaltante 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                `}
              />
              {errors.informacionFaltante && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.informacionFaltante.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {watch('informacionFaltante')?.length || 0}/500 caracteres
              </p>
            </div>
          </FormStep>

          {/* PASO 6: Contexto Personal */}
          <FormStep
            isActive={currentStep === 6}
            title={PASOS_CONFIG[5].titulo}
            subtitle={PASOS_CONFIG[5].subtitulo}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contexto personal o empresarial adicional (opcional)
              </label>
              <textarea
                {...register('contextoPersonal')}
                rows={4}
                placeholder="Ejemplo: Soy emprendedor con 5 años de experiencia en gastronomía. Mi presupuesto máximo es $50.000 USD. Prefiero crecimiento gradual antes que riesgos altos..."
                className={`
                  w-full px-4 py-3 rounded-lg border resize-none
                  ${errors.contextoPersonal 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                `}
              />
              {errors.contextoPersonal && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.contextoPersonal.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {watch('contextoPersonal')?.length || 0}/300 caracteres • Campo opcional
              </p>
            </div>
          </FormStep>
        </div>

        {/* Error de envío */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {submitError}
            </p>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`
              flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
              ${currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`
                flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-all
                ${!isValid || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Iniciar Análisis Estratégico
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}