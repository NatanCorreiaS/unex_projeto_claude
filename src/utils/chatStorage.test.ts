import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  CHAT_MAX_MESSAGES,
  CHAT_STORAGE_KEY,
  clearMessages,
  loadMessages,
  loadOpenState,
  saveMessages,
  saveOpenState,
} from './chatStorage'
import type { ChatMessage } from '../types'

function makeMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'test-id',
    role: 'user',
    text: 'Olá',
    timestamp: Date.now(),
    ...overrides,
  }
}

describe('chatStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  describe('loadMessages / saveMessages', () => {
    it('retorna array vazio quando não há dados', () => {
      expect(loadMessages()).toEqual([])
    })

    it('persiste e recupera mensagens corretamente', () => {
      const msgs = [makeMessage({ id: '1', text: 'Oi' }), makeMessage({ id: '2', role: 'model', text: 'Olá!' })]
      saveMessages(msgs)
      expect(loadMessages()).toEqual(msgs)
    })

    it('trunca para CHAT_MAX_MESSAGES mais recentes', () => {
      const msgs = Array.from({ length: CHAT_MAX_MESSAGES + 10 }, (_, i) =>
        makeMessage({ id: String(i), text: `msg ${i}` }),
      )
      saveMessages(msgs)
      const loaded = loadMessages()
      expect(loaded).toHaveLength(CHAT_MAX_MESSAGES)
      expect(loaded[0].id).toBe('10')
    })

    it('retorna vazio para JSON inválido', () => {
      window.localStorage.setItem(CHAT_STORAGE_KEY, 'not-json')
      expect(loadMessages()).toEqual([])
    })

    it('filtra entradas malformadas', () => {
      window.localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify([{ id: '1', role: 'user', text: 'ok', timestamp: 123 }, { bad: true }]),
      )
      const loaded = loadMessages()
      expect(loaded).toHaveLength(1)
      expect(loaded[0].id).toBe('1')
    })

    it('clearMessages remove o histórico', () => {
      saveMessages([makeMessage()])
      clearMessages()
      expect(loadMessages()).toEqual([])
    })
  })

  describe('loadOpenState / saveOpenState', () => {
    it('retorna false por padrão', () => {
      expect(loadOpenState()).toBe(false)
    })

    it('persiste estado aberto', () => {
      saveOpenState(true)
      expect(loadOpenState()).toBe(true)
      saveOpenState(false)
      expect(loadOpenState()).toBe(false)
    })
  })
})
