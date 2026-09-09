// Popup chatbot canto inferior direito — botão flutuante + janela com histórico
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, MessageCircle, Send, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useChatbot } from '../../hooks/useChatbot'

export function Chatbot() {
  const { messages, isOpen, status, error, toggleOpen, setIsOpen, sendMessage, clearHistory } = useChatbot()
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isLoading = status === 'loading'
  const lastMessage = messages[messages.length - 1]
  const isStreaming = isLoading && lastMessage?.role === 'model' && lastMessage.text.length > 0
  const showTypingDots = isLoading && !isStreaming && (!lastMessage || lastMessage.role === 'user' || lastMessage.text === '')

  // Auto-scroll ao fim
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isLoading])

  // Foca input ao abrir
  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 200)
      return () => window.clearTimeout(id)
    }
  }, [isOpen])

  // Fecha com Esc
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, setIsOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="chat-window"
            role="dialog"
            aria-label="Assistente virtual da Unex"
            aria-modal="false"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex h-[min(480px,70vh)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-navy-900/15 sm:w-[380px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-navy-900 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-magenta-500">
                  <Bot size={16} className="text-white" aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">Assistente Unex</p>
                  <p className="text-xs text-white/70">Online agora</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 ? (
                  <button type="button" onClick={clearHistory} aria-label="Limpar conversa" title="Limpar conversa" className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
                    <Trash2 size={16} />
                  </button>
                ) : null}
                <button type="button" onClick={() => setIsOpen(false)} aria-label="Fechar chat" className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Lista */}
            <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 px-4 py-4" aria-live="polite" aria-relevant="additions">
              {messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-2 py-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <MessageCircle size={20} className="text-magenta-500" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Olá! Como posso ajudar?</p>
                    <p className="mx-auto mt-1 max-w-[28ch] text-xs leading-relaxed text-slate-500">Pergunte sobre cursos, unidades, vestibular, bolsas ou vida acadêmica. Sua conversa fica salva apenas neste navegador.</p>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {['Quais cursos vocês oferecem?', 'Onde fica a unidade de Feira?', 'Como funciona o vestibular?'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setInput(suggestion)
                          inputRef.current?.focus()
                        }}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-magenta-200 hover:bg-magenta-50 hover:text-magenta-600"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'rounded-br-md bg-magenta-500 text-white' : 'rounded-bl-md bg-white text-slate-700 ring-1 ring-slate-200'}`}>
                      <p className="whitespace-pre-wrap break-words">
                        {msg.text}
                        {isStreaming && msg.id === lastMessage?.id && msg.role === 'model' ? <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-slate-400 align-middle" aria-hidden /> : null}
                      </p>
                      <span className={`mt-1 block text-[10px] ${msg.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {showTypingDots ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                    <span className="flex items-center gap-1" aria-label="Digitando">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                    </span>
                  </div>
                </div>
              ) : null}

              {error ? (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </p>
              ) : null}
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 bg-white">
              <p className="px-4 pt-2 text-[10px] leading-relaxed text-slate-400">Conversas salvas apenas neste navegador. Não compartilhe dados sensíveis.</p>
              <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  aria-label="Mensagem para o assistente"
                  maxLength={500}
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-magenta-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-magenta-100"
                  disabled={isLoading}
                />
                <button type="submit" disabled={!input.trim() || isLoading} aria-label="Enviar mensagem" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-magenta-500 text-white shadow-md transition hover:bg-magenta-600 disabled:opacity-40 disabled:shadow-none">
                  <Send size={16} aria-hidden />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Botão flutuante */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? 'Fechar assistente virtual' : 'Abrir assistente virtual'}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta-500 ${isOpen ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-magenta-500 text-white hover:bg-magenta-600'}`}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>
    </div>
  )
}
