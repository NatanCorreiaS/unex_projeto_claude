// Gemini server-side — Interactions API (@google/genai), key em process.env, histórico via front
import { GoogleGenAI } from '@google/genai'

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

export const GEMINI_MODEL = 'gemini-3.5-flash-lite'
export const GEMINI_MAX_HISTORY = 20

// Instrução de sistema Unex
export function buildSystemInstruction(): string {
  return [
    'Você é o assistente virtual da Unex — Centro Universitário de Excelência.',
    'Seu papel é ajudar visitantes do site institucional com informações sobre cursos, unidades, vestibular, bolsas e vida acadêmica.',
    '',
    'Diretrizes:',
    '- Responda sempre em português do Brasil, de forma acolhedora, objetiva e prestativa.',
    '- Use informações do site quando disponíveis. Se não souber, diga que não tem a informação e sugira entrar em contato pelo formulário ou telefone.',
    '- Cursos principais: Medicina, Direito, Odontologia, Enfermagem, Engenharia Civil, Psicologia, Sistemas de Informação, Administração.',
    '- Unidades: Feira de Santana (BA), Itabuna (BA), Jequié (BA), Vitória da Conquista (BA).',
    '- Vestibular/ENEM/transferência e bolsas: oriente a verificar o edital mais recente ou falar com a secretaria.',
    '- Seja conciso (máximo 4-5 frases por resposta, salvo quando o usuário pedir detalhes).',
    '- Nunca invente endereços, telefones ou valores de mensalidade.',
    '- Se o usuário compartilhar dados sensíveis, lembre que a conversa fica apenas no navegador dele.',
  ].join('\n')
}

// API key server-side (nunca expor no front)
export function getApiKey(): string | undefined {
  const key = process.env['GEMINI_API_KEY'] ?? process.env['GOOGLE_API_KEY'] ?? process.env['VITE_GEMINI_API_KEY']
  if (key && key.trim().length > 0) return key.trim()
  return undefined
}

// Compat: converte histórico para formato antigo (usado em testes)
export function toGeminiHistory(messages: ChatMessage[]): { role: string; parts: { text: string }[] }[] {
  const recent = messages.slice(-GEMINI_MAX_HISTORY)
  return recent.map((m) => ({ role: m.role, parts: [{ text: m.text }] }))
}

// Chat não-streaming via Interactions API
export async function sendMessageToGemini(
  history: ChatMessage[],
  userText: string,
  apiKeyOverride?: string,
): Promise<string> {
  const apiKey = apiKeyOverride ?? getApiKey()

  if (!apiKey) {
    return (
      'O chat está em modo demonstração no momento (chave do Gemini não configurada no servidor). ' +
      'Configure `GEMINI_API_KEY` no ambiente do backend. ' +
      'Enquanto isso, posso ajudar com informações gerais: me diga qual curso ou unidade te interessa!'
    )
  }

  if (!userText.trim()) throw new Error('Mensagem vazia.')

  try {
    console.log('[Gemini] Iniciando chamada', { model: GEMINI_MODEL, historyLength: history.length, userTextPreview: userText.slice(0, 80), hasApiKey: !!apiKey })
    const ai = new GoogleGenAI({ apiKey })

    const historyText = history.slice(-GEMINI_MAX_HISTORY).map((m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.text}`).join('\n')
    const fullInput = historyText ? `${historyText}\nUsuário: ${userText}` : userText
    console.log('[Gemini] fullInput', { length: fullInput.length, preview: fullInput.slice(0, 200) })

    console.log('[Gemini] ai.interactions.create...')
    const interaction = await (ai.interactions as unknown as { create: (p: Record<string, unknown>) => Promise<Record<string, unknown>> }).create({
      model: GEMINI_MODEL,
      system_instruction: buildSystemInstruction(),
      input: fullInput,
    })
    console.log('[Gemini] Resposta bruta', JSON.stringify(interaction).slice(0, 1000))

    const outputText: string | undefined =
      (interaction as unknown as { output_text?: string }).output_text ??
      (interaction as unknown as { outputs?: { type?: string; text?: string }[] }).outputs?.find((o) => o.type === 'text' || !!o.text)?.text ??
      (interaction as unknown as { outputs?: { text?: string }[] }).outputs?.[0]?.text

    const text = typeof outputText === 'string' ? outputText.trim() : ''
    if (!text) {
      console.warn('[Gemini] ⚠️ Resposta vazia', { interactionKeys: Object.keys(interaction) })
      return 'Não consegui gerar uma resposta agora. Tente reformular sua pergunta?'
    }

    console.log('[Gemini] ✅ Texto extraído', { length: text.length, preview: text.slice(0, 150) })
    return text
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Gemini] ❌ Erro Interactions API', { message, stack: error instanceof Error ? error.stack : undefined })
    if (message.toLowerCase().includes('api key') || message.includes('API_KEY_INVALID')) {
      return 'A chave do Gemini parece inválida. Verifique `GEMINI_API_KEY` no servidor.'
    }
    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      return 'O serviço está com muitas solicitações no momento. Tente novamente em alguns instantes.'
    }
    return 'Ocorreu um erro ao conectar com o assistente. Verifique sua conexão e tente novamente.'
  }
}

// Streaming SSE — yield de deltas de texto
export async function* streamMessageToGemini(
  history: ChatMessage[],
  userText: string,
  apiKeyOverride?: string,
): AsyncGenerator<string, void, unknown> {
  const apiKey = apiKeyOverride ?? getApiKey()

  if (!apiKey) {
    const msg = 'O chat está em modo demonstração no momento (chave do Gemini não configurada no servidor). Configure `GEMINI_API_KEY` no ambiente do backend.'
    for (const word of msg.split(' ')) {
      yield word + ' '
      await new Promise((r) => setTimeout(r, 30))
    }
    return
  }

  if (!userText.trim()) throw new Error('Mensagem vazia.')

  console.log('[Gemini][stream] Iniciando', { model: GEMINI_MODEL, historyLength: history.length, userTextPreview: userText.slice(0, 80) })
  const ai = new GoogleGenAI({ apiKey })

  const historyText = history.slice(-GEMINI_MAX_HISTORY).map((m) => `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.text}`).join('\n')
  const fullInput = historyText ? `${historyText}\nUsuário: ${userText}` : userText

  try {
    const maybeStream = (ai.interactions as unknown as { create: (p: Record<string, unknown>) => Promise<unknown> }).create({
      model: GEMINI_MODEL,
      system_instruction: buildSystemInstruction(),
      input: fullInput,
      stream: true,
    })

    const stream = (await maybeStream) as AsyncIterable<Record<string, unknown>>

    if (!stream || typeof (stream as AsyncIterable<unknown>)[Symbol.asyncIterator] !== 'function') {
      console.warn('[Gemini][stream] Sem stream, fallback para sendMessageToGemini')
      const full = await sendMessageToGemini(history, userText, apiKey)
      for (const word of full.split(' ')) {
        yield word + ' '
        await new Promise((r) => setTimeout(r, 20))
      }
      return
    }

    for await (const event of stream as AsyncIterable<Record<string, unknown>>) {
      const eventType = (event as { event_type?: string }).event_type
      const delta = (event as { delta?: { type?: string; text?: string } }).delta
      if (eventType === 'step.delta' && delta?.type === 'text' && delta.text) {
        yield delta.text
      } else if (delta?.type === 'text' && delta.text) {
        yield delta.text
      }
      if (eventType) console.log('[Gemini][stream] evento', { eventType, deltaType: delta?.type, preview: delta?.text?.slice(0, 60) })
    }
    console.log('[Gemini][stream] ✅ Concluído')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Gemini][stream] ❌ Erro', { message, stack: error instanceof Error ? error.stack : undefined })
    if (message.toLowerCase().includes('api key') || message.includes('API_KEY_INVALID')) {
      yield 'A chave do Gemini parece inválida. Verifique `GEMINI_API_KEY`.'
      return
    }
    if (message.includes('429') || message.toLowerCase().includes('quota')) {
      yield 'O serviço está com muitas solicitações no momento. Tente novamente em instantes.'
      return
    }
    throw error
  }
}

// Exemplo function calling (corrigido):
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// const weatherTool = { type:"function", name:"get_weather", parameters:{...} };
// let it = await ai.interactions.create({ model:"gemini-3.5-flash", input:"...", tools:[weatherTool] });
// // const call = it.outputs.find(o=>o.type==="function_call"); const result={weather:"Sunny"};
// // it = await ai.interactions.create({ model, previous_interaction_id: it.id, input:[{type:"function_result", name:call.name, call_id:call.id, result}] });
export const __exampleCorrectedSnippet = true
