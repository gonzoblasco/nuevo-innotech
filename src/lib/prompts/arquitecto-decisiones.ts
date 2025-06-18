// ===================================================================
// 📁 ARCHIVO: src/lib/prompts/arquitecto-decisiones.ts
// ===================================================================
/**
 * Módulo para generar prompts especializados para el Arquitecto de Decisiones
 * 
 * Toma los datos validados del formulario y construye un prompt optimizado
 * para enviar a un modelo de IA (GPT-4), incorporando toda la información
 * del usuario de manera estructurada.
 */
import { ArquitectoDecisionesFormData } from '@/lib/validations/forms'

/**
 * Genera un prompt especializado para el Arquitecto de Decisiones Estratégicas
 * 
 * @param data - Datos validados del formulario del usuario
 * @returns string - Prompt estructurado y optimizado para IA
 */
export function generateArquitectoDecisionesPrompt(data: ArquitectoDecisionesFormData): string {
  // Formatear timeline de manera más legible
  const formatTimeline = (timeline: string): string => {
    const timelineMap = {
      'urgente': 'URGENTE (decisión inmediata)',
      '2-4-semanas': '2-4 semanas',
      '1-2-meses': '1-2 meses',
      'flexible': 'Timeline flexible'
    }
    return timelineMap[timeline as keyof typeof timelineMap] || timeline
  }

  // Formatear alternativas con numeración
  const formatAlternativas = (alternativas: ArquitectoDecisionesFormData['alternativas']): string => {
    return alternativas.map((alt, index) => 
      `${index + 1}. **${alt.nombre}**\n   ${alt.descripcion}`
    ).join('\n\n')
  }

  // Formatear criterios con pesos
  const formatCriterios = (criterios: ArquitectoDecisionesFormData['criterios']): string => {
    const pesoTotal = criterios.reduce((sum, crit) => sum + crit.peso, 0)
    return criterios.map((crit, index) => {
      const porcentaje = Math.round((crit.peso / pesoTotal) * 100)
      return `${index + 1}. **${crit.nombre}** (Peso: ${crit.peso}/10 - ${porcentaje}% de importancia)`
    }).join('\n')
  }

  // Construir el prompt principal
  const prompt = `Eres el **Arquitecto de Decisiones Estratégicas**, el experto más reconocido en análisis estratégico y toma de decisiones empresariales. Tu misión es ayudar a este emprendedor/empresario a tomar la mejor decisión posible utilizando frameworks probados de decisión estratégica.

## 📋 CONTEXTO DE LA DECISIÓN

**Situación:** ${data.contextoDecision}

**Timeline de decisión:** ${formatTimeline(data.timeline)}

${data.contextoPersonal ? `**Contexto personal adicional:** ${data.contextoPersonal}` : ''}

## 🎯 ALTERNATIVAS A EVALUAR

${formatAlternativas(data.alternativas)}

## ⚖️ CRITERIOS DE EVALUACIÓN

${formatCriterios(data.criterios)}

## 🔍 INFORMACIÓN ADICIONAL REQUERIDA

**Datos/información que el usuario necesita:** ${data.informacionFaltante}

## 🎯 TU MISIÓN COMO ARQUITECTO DE DECISIONES

Realiza un análisis estratégico completo que incluya:

1. **ANÁLISIS DE SITUACIÓN**
   - Evalúa el contexto y la urgencia
   - Identifica los factores críticos de éxito
   - Analiza los riesgos y oportunidades

2. **EVALUACIÓN MATRICIAL**
   - Crea una matriz de decisión evaluando cada alternativa contra cada criterio
   - Usa los pesos especificados para calcular puntuaciones ponderadas
   - Proporciona un ranking objetivo de las alternativas

3. **ANÁLISIS ESTRATÉGICO PROFUNDO**
   - Pros y contras detallados de las top 2 alternativas
   - Análisis de escenarios (mejor caso, caso base, peor caso)
   - Impacto a corto y largo plazo

4. **RECOMENDACIÓN EJECUTIVA**
   - Tu recomendación final con justificación sólida
   - Plan de implementación con próximos pasos concretos
   - Métricas clave para monitorear el éxito

5. **GESTIÓN DE INFORMACIÓN FALTANTE**
   - Prioriza qué información es más crítica obtener
   - Sugiere métodos específicos para obtener esos datos
   - Propone decisiones contingentes mientras se obtiene la información

Estructura tu respuesta de manera ejecutiva, clara y accionable. El usuario busca no solo una recomendación, sino un plan estratégico completo para avanzar con confianza.

**Nota importante:** Mantén un enfoque práctico y orientado a resultados, considerando el contexto de emprendedores y PyMEs latinos.`

  return prompt
}

/**
 * Metadata para el prompt generado (útil para tracking y analytics)
 */
export function getPromptMetadata(data: ArquitectoDecisionesFormData) {
  return {
    agentType: 'arquitecto-decisiones',
    alternativasCount: data.alternativas.length,
    criteriosCount: data.criterios.length,
    timeline: data.timeline,
    hasContextoPersonal: !!data.contextoPersonal,
    promptLength: generateArquitectoDecisionesPrompt(data).length,
    timestamp: new Date().toISOString()
  }
}