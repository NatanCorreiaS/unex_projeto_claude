// Hook chatbot — estado, streaming e persistência em localStorage
import { useCallback, useEffect, useRef, useState } from 'react'
import { streamMessageToGemini } from '../ai/gemini'
import type { ChatMessage, ChatStatus } from '../types'
import { clearMessages as clearStoredMessages, loadMessages, loadOpenState, saveMessages, saveOpenState } from '../utils/chatStorage'

export function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createChatMessage(role: ChatMessage['role'], text: string): ChatMessage {
  return { id: createMessageId(), role, text, timestamp: Date.now() }
}

export interface UseChatbotReturn {
  messages: ChatMessage[]
  isOpen: boolean
  status: ChatStatus
  error: string | null
  toggleOpen: () => void
  setIsOpen: (open: boolean) => void
  sendMessage: (text: string) => Promise<void>
  clearHistory: () => void
}

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages())
  const [isOpen, setIsOpenState] = useState<boolean>(() => loadOpenState())
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    saveMessages(messages)
  }, [messages])

  useEffect(() => {
    if (!hasMounted.current) return
    saveOpenState(isOpen)
  }, [isOpen])

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open)
    saveOpenState(open)
  }, [])

  const toggleOpen = useCallback(() => {
    setIsOpenState((prev) => {
      const next = !prev
      saveOpenState(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setMessages([])
    setError(null)
    setStatus('idle')
    clearStoredMessages()
  }, [])

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim()
      if (!text) {
        console.warn('[useChatbot] Mensagem vazia ignorada')
        return
      }

      console.log('[useChatbot] → sendMessage (stream)', { text, historyLength: messages.length })
      const userMessage = createChatMessage('user', text)
      setMessages((prev) => [...prev, userMessage])
      setStatus('loading')
      setError(null)

      const placeholderId = createMessageId()
      const placeholder: ChatMessage = { id: placeholderId, role: 'model', text: '', timestamp: Date.now() }
      setMessages((prev) => [...prev, placeholder])

      try {
        const historySnapshot = messages
        console.log('[useChatbot] streamMessageToGemini → /api/chat/stream', { historySnapshot, text })
        let accumulated = ''

        const fullText = await streamMessageToGemini(historySnapshot, text, (chunk) => {
          accumulated += chunk
          console.log('[useChatbot] chunk', { chunk: chunk.slice(0, 60), accumulatedLength: accumulated.length })
          setMessages((prev) => prev.map((m) => (m.id === placeholderId ? { ...m, text: accumulated } : m)))
        })

        console.log('[useChatbot] ← Stream completo', { length: fullText.length, preview: fullText.slice(0, 150) })
        if (accumulated !== fullText && fullText) {
          setMessages((prev) => prev.map((m) => (m.id === placeholderId ? { ...m, text: fullText } : m)))
        }

        if (!fullText || !fullText.trim()) {
          console.warn('[useChatbot] ⚠️ Resposta vazia', { fullText })
          setMessages((prev) => prev.filter((m) => m.id !== placeholderId))
          setError('Não consegui gerar resposta. Tente novamente.')
          setStatus('error')
          return
        }

        setStatus('idle')
        console.log('[useChatbot] ✅ Streaming concluído')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao enviar mensagem.'
        console.error('[useChatbot] ❌ Erro streaming', { error: msg, stack: err instanceof Error ? err.stack : undefined })
        setMessages((prev) => prev.filter((m) => m.id !== placeholderId))
        setError(msg)
        setStatus('error')
      }
    },
    [messages],
  )

  return { messages, isOpen, status, error, toggleOpen, setIsOpen, sendMessage, clearHistory }
}
