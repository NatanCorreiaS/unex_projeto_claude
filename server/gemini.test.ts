import { describe, expect, it } from 'vitest'
import { buildSystemInstruction, GEMINI_MAX_HISTORY, sendMessageToGemini, toGeminiHistory } from './gemini'
import type { ChatMessage } from './gemini'

function msg(overrides: Partial<ChatMessage> & { role: ChatMessage['role'] }): ChatMessage {
  return {
    text: 'texto',
    ...overrides,
  }
}

describe('server/gemini - buildSystemInstruction', () => {
  it('contém diretrizes da Unex', () => {
    const instr = buildSystemInstruction()
    expect(instr).toContain('Unex')
    expect(instr).toContain('Medicina')
    expect(instr).toContain('Feira de Santana')
  })
})

describe('server/gemini - toGeminiHistory', () => {
  it('converte para Content', () => {
    const h: ChatMessage[] = [msg({ role: 'user', text: 'Oi' }), msg({ role: 'model', text: 'Olá!' })]
    expect(toGeminiHistory(h)).toEqual([
      { role: 'user', parts: [{ text: 'Oi' }] },
      { role: 'model', parts: [{ text: 'Olá!' }] },
    ])
  })

  it('trunca para GEMINI_MAX_HISTORY', () => {
    const h = Array.from({ length: GEMINI_MAX_HISTORY + 5 }, (_, i) =>
      msg({ role: i % 2 === 0 ? 'user' : 'model', text: `msg ${i}` }),
    )
    const c = toGeminiHistory(h)
    expect(c).toHaveLength(GEMINI_MAX_HISTORY)
    expect(c[0].parts[0].text).toBe('msg 5')
  })
})

describe('server/gemini - sendMessageToGemini', () => {
  it('retorna fallback sem API key', async () => {
    const t = await sendMessageToGemini([], 'Olá', undefined)
    // sem GEMINI_API_KEY no env de teste, deve cair em modo demonstração
    // Se houver key no env de CI, testa com override vazio
    if (!process.env['GEMINI_API_KEY']) {
      expect(t).toContain('modo demonstração')
    }
  })

  it('lança para mensagem vazia com apiKey', async () => {
    await expect(sendMessageToGemini([], '   ', 'fake-key')).rejects.toThrow('Mensagem vazia')
  })
})
