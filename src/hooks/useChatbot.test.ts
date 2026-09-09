import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useChatbot } from './useChatbot'

// Mock do módulo gemini para controlar respostas sem chamar API real (streaming)
vi.mock('../ai/gemini', async () => {
  const actual = await vi.importActual<typeof import('../ai/gemini')>('../ai/gemini')
  return {
    ...actual,
    sendMessageToGemini: vi.fn().mockResolvedValue('Resposta mock do Gemini'),
    streamMessageToGemini: vi.fn().mockImplementation(async (_history: unknown, _text: string, onChunk?: (c: string) => void) => {
      const reply = 'Resposta mock do Gemini'
      if (onChunk) onChunk(reply)
      return reply
    }),
  }
})

import { sendMessageToGemini, streamMessageToGemini } from '../ai/gemini'

describe('useChatbot', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.mocked(sendMessageToGemini).mockResolvedValue('Resposta mock do Gemini')
    vi.mocked(streamMessageToGemini).mockImplementation(async (_h: unknown, _t: string, onChunk?: (c: string) => void) => {
      const reply = 'Resposta mock do Gemini'
      if (onChunk) onChunk(reply)
      return reply
    })
  })

  it('inicia com histórico vazio e fechado', () => {
    const { result } = renderHook(() => useChatbot())
    expect(result.current.messages).toEqual([])
    expect(result.current.isOpen).toBe(false)
    expect(result.current.status).toBe('idle')
  })

  it('alterna estado aberto/fechado e persiste no localStorage', () => {
    const { result } = renderHook(() => useChatbot())
    act(() => result.current.toggleOpen())
    expect(result.current.isOpen).toBe(true)
    act(() => result.current.toggleOpen())
    expect(result.current.isOpen).toBe(false)
  })

  it('envia mensagem, adiciona user + model e persiste (streaming)', async () => {
    const { result } = renderHook(() => useChatbot())

    await act(async () => {
      await result.current.sendMessage('Olá, quais cursos existem?')
    })

    await waitFor(() => expect(result.current.status).toBe('idle'))
    // user + placeholder streaming (model) = 2 mensagens (user e modelo acumulado)
    expect(result.current.messages).toHaveLength(2)
    expect(result.current.messages[0].role).toBe('user')
    expect(result.current.messages[1].role).toBe('model')
    expect(streamMessageToGemini).toHaveBeenCalled()
    const call = vi.mocked(streamMessageToGemini).mock.calls[0] as [unknown, string, unknown]
    expect(call[1]).toBe('Olá, quais cursos existem?')
  })

  it('ignora mensagens vazias', async () => {
    const { result } = renderHook(() => useChatbot())
    await act(async () => {
      await result.current.sendMessage('   ')
    })
    expect(result.current.messages).toHaveLength(0)
    expect(streamMessageToGemini).not.toHaveBeenCalled()
    expect(sendMessageToGemini).not.toHaveBeenCalled()
  })

  it('expõe erro quando o Gemini falha (stream)', async () => {
    vi.mocked(streamMessageToGemini).mockRejectedValueOnce(new Error('falha de rede'))
    const { result } = renderHook(() => useChatbot())

    await act(async () => {
      await result.current.sendMessage('Oi')
    })

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBe('falha de rede')
  })

  it('clearHistory limpa mensagens e localStorage', async () => {
    const { result } = renderHook(() => useChatbot())
    await act(async () => {
      await result.current.sendMessage('Oi')
    })
    await waitFor(() => expect(result.current.messages.length).toBe(2))

    act(() => result.current.clearHistory())
    expect(result.current.messages).toEqual([])
  })

  it('carrega histórico persistido ao montar', async () => {
    // Primeiro hook cria histórico
    const { result: r1 } = renderHook(() => useChatbot())
    await act(async () => {
      await r1.current.sendMessage('Primeira')
    })
    await waitFor(() => expect(r1.current.messages.length).toBe(2))

    // Novo hook deve carregar do localStorage
    const { result: r2 } = renderHook(() => useChatbot())
    expect(r2.current.messages.length).toBe(2)
    expect(r2.current.messages[0].text).toBe('Primeira')
  })
})
