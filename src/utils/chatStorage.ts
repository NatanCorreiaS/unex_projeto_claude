// Persistência do chatbot em localStorage — histórico e estado open

import type { ChatMessage } from '../types'

/** Chave usada no localStorage para o histórico do chatbot. */
export const CHAT_STORAGE_KEY = 'unex:chatbot:messages'

/** Chave para o estado aberto/fechado do popup. */
export const CHAT_OPEN_KEY = 'unex:chatbot:open'

/** Número máximo de mensagens mantidas em memória/persistência. */
export const CHAT_MAX_MESSAGES = 50

/** Checa localStorage disponível (SSR/privado). */
function isStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

/** Carrega histórico; retorna [] se vazio/inválido. */
export function loadMessages(): ChatMessage[] {
  if (!isStorageAvailable()) return []
  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Validação leve: filtra entradas malformadas sem quebrar a leitura
    return (parsed as ChatMessage[]).filter(
      (m) =>
        typeof m === 'object' &&
        m !== null &&
        typeof m.id === 'string' &&
        (m.role === 'user' || m.role === 'model') &&
        typeof m.text === 'string' &&
        typeof m.timestamp === 'number',
    )
  } catch {
    return []
  }
}

/** Persiste truncado em CHAT_MAX_MESSAGES; ignora erros de quota. */
export function saveMessages(messages: ChatMessage[]): void {
  if (!isStorageAvailable()) return
  try {
    const truncated = messages.slice(-CHAT_MAX_MESSAGES)
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(truncated))
  } catch {
    // ignora erros de quota/storage
  }
}

/** Remove histórico. */
export function clearMessages(): void {
  if (!isStorageAvailable()) return
  try {
    window.localStorage.removeItem(CHAT_STORAGE_KEY)
  } catch {
    // ignora
  }
}

/** Carrega estado open do popup. */
export function loadOpenState(): boolean {
  if (!isStorageAvailable()) return false
  try {
    return window.localStorage.getItem(CHAT_OPEN_KEY) === 'true'
  } catch {
    return false
  }
}

/** Persiste estado open. */
export function saveOpenState(isOpen: boolean): void {
  if (!isStorageAvailable()) return
  try {
    window.localStorage.setItem(CHAT_OPEN_KEY, String(isOpen))
  } catch {
    // ignora
  }
}
