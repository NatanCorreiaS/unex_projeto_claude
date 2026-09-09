import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { buildSystemInstruction, GEMINI_MAX_HISTORY, sendMessageToGemini, toGeminiHistory } from './gemini'
import type { ChatMessage } from '../types'

function msg(overrides: Partial<ChatMessage> & { role: ChatMessage['role'] }): ChatMessage {
  return {
    id: Math.random().toString(36).slice(2),
    text: 'texto',
    timestamp: Date.now(),
    ...overrides,
  }
}

describe('buildSystemInstruction', () => {
  it('contém diretrizes da Unex e cursos/unidades', () => {
    const instr = buildSystemInstruction()
    expect(instr).toContain('Unex')
    expect(instr).toContain('Medicina')
    expect(instr).toContain('Feira de Santana')
    expect(instr).toContain('português do Brasil')
  })
})

describe('toGeminiHistory', () => {
  it('converte mensagens para formato Content', () => {
    const history: ChatMessage[] = [msg({ role: 'user', text: 'Oi' }), msg({ role: 'model', text: 'Olá!' })]
    const contents = toGeminiHistory(history)
    expect(contents).toEqual([
      { role: 'user', parts: [{ text: 'Oi' }] },
      { role: 'model', parts: [{ text: 'Olá!' }] },
    ])
  })

  it('trunca para GEMINI_MAX_HISTORY mais recentes', () => {
    const history = Array.from({ length: GEMINI_MAX_HISTORY + 5 }, (_, i) =>
      msg({ role: i % 2 === 0 ? 'user' : 'model', text: `msg ${i}` }),
    )
    const contents = toGeminiHistory(history)
    expect(contents).toHaveLength(GEMINI_MAX_HISTORY)
    expect(contents[0].parts[0].text).toBe('msg 5')
  })
})

describe('sendMessageToGemini (cliente -> /api/chat)', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    globalThis.fetch = originalFetch
  })

  it('lança erro para mensagem vazia antes de chamar fetch', async () => {
    await expect(sendMessageToGemini([], '   ')).rejects.toThrow('Mensagem vazia')
    expect(vi.mocked(fetch)).not.toHaveBeenCalled()
  })

  it('chama POST /api/chat e retorna reply', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ reply: 'Olá, sou o assistente Unex!' }), { status: 200 }),
    )

    const reply = await sendMessageToGemini([], 'Oi')
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1)
    const [url, opts] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/chat')
    expect(opts.method).toBe('POST')
    expect(reply).toBe('Olá, sou o assistente Unex!')
  })

  it('envia histórico truncado (sem id/timestamp)', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ reply: 'ok' }), { status: 200 }))

    const history = Array.from({ length: GEMINI_MAX_HISTORY + 5 }, (_, i) =>
      msg({ role: 'user', text: `msg ${i}` }),
    )
    await sendMessageToGemini(history, 'pergunta')

    const [, opts] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(opts.body as string) as { history: { role: string; text: string }[] }
    expect(body.history).toHaveLength(GEMINI_MAX_HISTORY)
    expect(body.history[0].text).toBe('msg 5')
    expect(body.history[0]).not.toHaveProperty('id')
  })

  it('retorna mensagem amigável quando fetch falha (backend offline)', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network'))
    const reply = await sendMessageToGemini([], 'Oi')
    expect(reply).toContain('Não consegui conectar')
  })

  it('retorna reply vazio como fallback', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ reply: '   ' }), { status: 200 }))
    const reply = await sendMessageToGemini([], 'Oi')
    expect(reply).toContain('Não consegui gerar')
  })
})
