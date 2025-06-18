// ===================================================================
// 📁 ARCHIVO: src/lib/validations/forms.ts
// ===================================================================
/**
 * Esquemas de validación Zod para el formulario del Arquitecto de Decisiones
 * 
 * Define las reglas de validación para cada uno de los 6 pasos del formulario,
 * incluyendo validaciones para campos dinámicos (alternativas y criterios).
 */
import { z } from 'zod'

// Esquema para cada alternativa (campo dinámico)
const alternativaSchema = z.object({
  id: z.string(),
  nombre: z.string()
    .min(3, 'Cada alternativa debe tener al menos 3 caracteres')
    .max(100, 'Las alternativas no pueden exceder 100 caracteres')
    .trim(),
  descripcion: z.string()
    .min(10, 'Describe brevemente cada alternativa (mín. 10 caracteres)')
    .max(300, 'La descripción no puede exceder 300 caracteres')
    .trim()
})

// Esquema para cada criterio de evaluación (campo dinámico)
const criterioSchema = z.object({
  id: z.string(),
  nombre: z.string()
    .min(3, 'Cada criterio debe tener al menos 3 caracteres')
    .max(80, 'Los criterios no pueden exceder 80 caracteres')
    .trim(),
  peso: z.number()
    .min(1, 'El peso debe ser mínimo 1')
    .max(10, 'El peso debe ser máximo 10')
    .int('El peso debe ser un número entero')
})

// Esquema principal del formulario del Arquitecto de Decisiones
export const arquitectoDecisionesSchema = z.object({
  // Paso 1: Contexto de la decisión
  contextoDecision: z.string()
    .min(50, 'Describe el contexto con al menos 50 caracteres para un mejor análisis')
    .max(1000, 'El contexto no puede exceder 1000 caracteres')
    .trim(),

  // Paso 2: Timeline de la decisión
  timeline: z.enum(['urgente', '2-4-semanas', '1-2-meses', 'flexible'], {
    required_error: 'Selecciona un plazo para la decisión',
    invalid_type_error: 'Selecciona una opción válida de timeline'
  }),

  // Paso 3: Alternativas disponibles (array dinámico)
  alternativas: z.array(alternativaSchema)
    .min(2, 'Necesitas al menos 2 alternativas para poder compararlas')
    .max(6, 'Máximo 6 alternativas para mantener un análisis enfocado')
    .refine(
      (alternativas) => {
        const nombres = alternativas.map(alt => alt.nombre.toLowerCase())
        return new Set(nombres).size === nombres.length
      },
      { message: 'No puede haber alternativas con nombres duplicados' }
    ),

  // Paso 4: Criterios de evaluación (array dinámico)
  criterios: z.array(criterioSchema)
    .min(3, 'Define al menos 3 criterios para una evaluación completa')
    .max(8, 'Máximo 8 criterios para mantener la claridad del análisis')
    .refine(
      (criterios) => {
        const nombres = criterios.map(crit => crit.nombre.toLowerCase())
        return new Set(nombres).size === nombres.length
      },
      { message: 'No puede haber criterios con nombres duplicados' }
    )
    .refine(
      (criterios) => {
        const pesoTotal = criterios.reduce((sum, crit) => sum + crit.peso, 0)
        return pesoTotal <= 50 // Validación adicional de peso total razonable
      },
      { message: 'La suma de pesos es muy alta. Ajusta la importancia de los criterios.' }
    ),

  // Paso 5: Información faltante
  informacionFaltante: z.string()
    .min(20, 'Especifica qué información adicional necesitas (mín. 20 caracteres)')
    .max(500, 'Este campo no puede exceder 500 caracteres')
    .trim(),

  // Paso 6: Contexto personal (opcional)
  contextoPersonal: z.string()
    .max(300, 'El contexto personal no puede exceder 300 caracteres')
    .trim()
    .optional()
    .or(z.literal(''))
})

// Esquemas individuales para validación paso a paso
export const paso1Schema = arquitectoDecisionesSchema.pick({ contextoDecision: true })
export const paso2Schema = arquitectoDecisionesSchema.pick({ timeline: true })
export const paso3Schema = arquitectoDecisionesSchema.pick({ alternativas: true })
export const paso4Schema = arquitectoDecisionesSchema.pick({ criterios: true })
export const paso5Schema = arquitectoDecisionesSchema.pick({ informacionFaltante: true })
export const paso6Schema = arquitectoDecisionesSchema.pick({ contextoPersonal: true })

// Tipos TypeScript derivados de los esquemas
export type ArquitectoDecisionesFormData = z.infer<typeof arquitectoDecisionesSchema>
export type Alternativa = z.infer<typeof alternativaSchema>
export type Criterio = z.infer<typeof criterioSchema>
export type TimelineOption = z.infer<typeof arquitectoDecisionesSchema>['timeline']