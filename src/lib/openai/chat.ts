// ===================================================================
// 📁 ARCHIVO: src/lib/openai/chat.ts
// ===================================================================
/**
 * Cliente de OpenAI para manejo de chat completions con streaming
 * 
 * Características:
 * - Streaming de respuestas en tiempo real
 * - Conteo de tokens para costos
 * - Manejo de contexto e historial
 * - Rate limiting y manejo de errores
 */
import OpenAI from 'openai'

// Configuración del cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Interfaz para mensajes de chat
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Interfaz para configuración de chat
export interface ChatConfig {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// Configuración por defecto optimizada para el Arquitecto de Decisiones
const DEFAULT_CONFIG: Required<ChatConfig> = {
  model: 'gpt-4-turbo-preview', // Modelo más capaz para análisis estratégico
  temperature: 0.7, // Balance entre creatividad y consistencia
  maxTokens: 2000, // Suficiente para respuestas detalladas
  stream: true
}

/**
 * Crea un stream de chat completion con OpenAI
 * 
 * @param messages - Array de mensajes incluyendo historial
 * @param config - Configuración opcional del modelo
 * @returns AsyncIterable<string> - Stream de chunks de respuesta
 */
export async function createChatCompletion(
  messages: ChatMessage[],
  config: Partial<ChatConfig> = {}
): Promise<AsyncIterable<string>> {
  try {
    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    
    console.log('🤖 Iniciando chat completion...', {
      messageCount: messages.length,
      model: finalConfig.model,
      lastMessagePreview: messages[messages.length - 1]?.content.substring(0, 100)
    })

    // Validar que tenemos API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY no está configurada')
    }

    // Crear la completion con streaming
    const completion = await openai.chat.completions.create({
      model: finalConfig.model,
      messages: messages,
      temperature: finalConfig.temperature,
      max_tokens: finalConfig.maxTokens,
      stream: finalConfig.stream,
      // Configuraciones adicionales para mejor calidad
      presence_penalty: 0.1, // Reduce repetición
      frequency_penalty: 0.1, // Promueve variedad
    })

    // Retornar generator que yielda chunks de texto
    return (async function* () {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta
          const content = delta?.content || ''
          
          if (content) {
            yield content
          }
          
          // Log de fin de stream
          if (chunk.choices[0]?.finish_reason) {
            console.log('✅ Stream completado:', chunk.choices[0].finish_reason)
          }
        }
      } catch (error) {
        console.error('❌ Error en stream:', error)
        throw error
      }
    })()

  } catch (error) {
    console.error('❌ Error creando chat completion:', error)
    throw error
  }
}

/**
 * Estima el conteo de tokens para pricing
 * Implementación simplificada - en producción usar tiktoken
 */
export function estimateTokenCount(text: string): number {
  // Estimación aproximada: ~1.3 tokens por palabra en español
  const words = text.split(/\s+/).length
  return Math.ceil(words * 1.3)
}

/**
 * Calcula el costo estimado en centavos basado en tokens
 * Precios de GPT-4 Turbo (actualizar según pricing actual)
 */
export function calculateCost(inputTokens: number, outputTokens: number): number {
  const INPUT_COST_PER_1K = 1.0 // $0.01 per 1K tokens
  const OUTPUT_COST_PER_1K = 3.0 // $0.03 per 1K tokens
  
  const inputCost = (inputTokens / 1000) * INPUT_COST_PER_1K
  const outputCost = (outputTokens / 1000) * OUTPUT_COST_PER_1K
  
  return Math.ceil((inputCost + outputCost) * 100) // Convertir a centavos
}

/**
 * Construye el array de mensajes incluyendo system prompt e historial
 */
export function buildMessagesArray(
  systemPrompt: string,
  chatHistory: Array<{ role: 'user' | 'assistant', content: string }>,
  newUserMessage: string
): ChatMessage[] {
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt }
  ]

  // Agregar historial
  for (const msg of chatHistory) {
    messages.push({
      role: msg.role,
      content: msg.content
    })
  }

  // Agregar nuevo mensaje del usuario
  messages.push({
    role: 'user',
    content: newUserMessage
  })

  return messages
}