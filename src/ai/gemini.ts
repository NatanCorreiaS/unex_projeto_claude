// Cliente browser — chama backend Express, nunca expõe key. Histórico via localStorage.
import type { ChatMessage } from '../types'

export const GEMINI_MODEL = 'gemini-3.5-flash-lite'
export const GEMINI_MAX_HISTORY = 20

// Instrução Unex (fonte da verdade no server)
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

// Para testes: converte histórico para formato antigo
export function toGeminiHistory(messages: ChatMessage[]): { role: ChatMessage['role']; parts: { text: string }[] }[] {
  const recent = messages.slice(-GEMINI_MAX_HISTORY)
  return recent.map((m) => ({ role: m.role, parts: [{ text: m.text }] }))
}

export function isGeminiConfigured(): boolean {
  return true
}

// Chat não-streaming (POST /api/chat)
export async function sendMessageToGemini(history: ChatMessage[], userText: string): Promise<string> {
  if (!userText.trim()) throw new Error('Mensagem vazia.')

  const payloadHistory = history.slice(-GEMINI_MAX_HISTORY).map((m) => ({ role: m.role, text: m.text }))
  const baseUrl = (import.meta.env['VITE_API_URL'] as string | undefined) ?? ''
  const url = `${baseUrl.replace(/\/$/, '')}/api/chat`

  console.log('[Unex Chat] → Enviando', { url, message: userText, historyLength: payloadHistory.length })

  let res: Response
  try {
    console.log('[Unex Chat] fetch...', url)
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ history: payloadHistory, message: userText }) })
    console.log('[Unex Chat] resposta', { ok: res.ok, status: res.status, statusText: res.statusText })
  } catch (err) {
    console.error('[Unex Chat] ❌ Rede', { url, error: err instanceof Error ? err.message : String(err) })
    return 'Não consegui conectar ao servidor do chat. Verifique se o backend está rodando (`npm run server:dev` ou `npm run start`). Veja o console (F12).'
  }

  if (!res.ok) {
    try {
      const data = (await res.json()) as { error?: string }
      console.error('[Unex Chat] ❌ HTTP', { status: res.status, error: data })
      if (data.error) return `Erro do servidor: ${data.error}`
    } catch (e) {
      console.error('[Unex Chat] ❌ Parse erro HTTP', { status: res.status, error: e instanceof Error ? e.message : String(e) })
    }
    if (res.status === 429) return 'O serviço está com muitas solicitações no momento. Tente novamente em alguns instantes.'
    return 'Ocorreu um erro ao conectar com o assistente. Tente novamente. (ver console F12)'
  }

  try {
    const data = (await res.json()) as { reply?: string; error?: string }
    console.log('[Unex Chat] ← JSON', data)
    if (data.error) {
      console.error('[Unex Chat] ❌ {error}', data.error)
      return `Erro: ${data.error}`
    }
    if (typeof data.reply === 'string' && data.reply.trim()) {
      console.log('[Unex Chat] ✅ Reply', { length: data.reply.length, preview: data.reply.slice(0, 120) })
      return data.reply.trim()
    }
    console.warn('[Unex Chat] ⚠️ Sem reply', data)
    return 'Não consegui gerar uma resposta agora. Tente reformular sua pergunta? (ver console)'
  } catch (e) {
    console.error('[Unex Chat] ❌ Parse JSON sucesso', { error: e instanceof Error ? e.message : String(e) })
    return 'Resposta inválida do servidor. Tente novamente. (ver console F12)'
  }
}

// Streaming SSE (POST /api/chat/stream) — chama onChunk por delta
export async function streamMessageToGemini(
  history: ChatMessage[],
  userText: string,
  onChunk: (chunk: string) => void,
): Promise<string> {
  if (!userText.trim()) throw new Error('Mensagem vazia.')

  const payloadHistory = history.slice(-GEMINI_MAX_HISTORY).map((m) => ({ role: m.role, text: m.text }))
  const baseUrl = (import.meta.env['VITE_API_URL'] as string | undefined) ?? ''
  const url = `${baseUrl.replace(/\/$/, '')}/api/chat/stream`

  console.log('[Unex Chat][stream] →', { url, historyLength: payloadHistory.length, message: userText })

  let res: Response
  try {
    res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, body: JSON.stringify({ history: payloadHistory, message: userText }) })
    console.log('[Unex Chat][stream] status', { ok: res.ok, status: res.status })
  } catch (err) {
    console.error('[Unex Chat][stream] ❌ Rede', { url, error: err instanceof Error ? err.message : String(err) })
    throw new Error('Não consegui conectar ao servidor (stream).')
  }

  if (!res.ok) {
    try {
      const body = await res.json()
      console.error('[Unex Chat][stream] ❌ Não-ok', { status: res.status, body })
      throw new Error((body as { error?: string })?.error ?? `Erro stream ${res.status}`)
    } catch {
      throw new Error(`Erro stream ${res.status}`)
    }
  }

  if (!res.body) {
    console.warn('[Unex Chat][stream] Sem body, fallback para /api/chat')
    return sendMessageToGemini(history, userText)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        console.log('[Unex Chat][stream] done', { fullLength: fullText.length })
        break
      }
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() ?? ''
      for (const part of parts) {
        const line = part.trim()
        if (!line.startsWith('data:')) continue
        const dataStr = line.slice(5).trim()
        if (dataStr === '[DONE]') {
          console.log('[Unex Chat][stream] [DONE]')
          continue
        }
        try {
          const data = JSON.parse(dataStr) as { text?: string; error?: string }
          if (data.error) {
            console.error('[Unex Chat][stream] ❌ Evento erro', data.error)
            throw new Error(data.error)
          }
          if (typeof data.text === 'string' && data.text) {
            fullText += data.text
            console.log('[Unex Chat][stream] chunk', { text: data.text.slice(0, 60), totalLength: fullText.length })
            onChunk(data.text)
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes('error')) throw e
          console.warn('[Unex Chat][stream] Linha ignorada', { line: dataStr.slice(0, 120) })
        }
      }
    }
  } finally {
    try {
      reader.releaseLock()
    } catch {}
  }

  console.log('[Unex Chat][stream] ✅ Completo', { length: fullText.length, preview: fullText.slice(0, 150) })
  return fullText
}

export function getApiKey(): string | undefined {
  return undefined
}
