import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Chatbot } from './Chatbot'

// Mock do hook useChatbot para controlar estado sem depender de Gemini/storage
vi.mock('../../hooks/useChatbot', () => ({
  useChatbot: vi.fn(),
}))

import { useChatbot } from '../../hooks/useChatbot'

const mockToggle = vi.fn()
const mockSetOpen = vi.fn()
const mockSend = vi.fn().mockResolvedValue(undefined)
const mockClear = vi.fn()

function mockReturn(overrides: Partial<ReturnType<typeof useChatbot>> = {}) {
  const base: ReturnType<typeof useChatbot> = {
    messages: [],
    isOpen: false,
    status: 'idle',
    error: null,
    toggleOpen: mockToggle,
    setIsOpen: mockSetOpen,
    sendMessage: mockSend,
    clearHistory: mockClear,
  }
  vi.mocked(useChatbot).mockReturnValue({ ...base, ...overrides })
}

describe('Chatbot', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza botão flutuante com aria-label de abrir', () => {
    mockReturn({ isOpen: false })
    render(<Chatbot />)
    expect(screen.getByLabelText('Abrir assistente virtual')).toBeInTheDocument()
  })

  it('não mostra janela quando fechado', () => {
    mockReturn({ isOpen: false })
    render(<Chatbot />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mostra janela e mensagem de boas-vindas quando aberto sem histórico', async () => {
    mockReturn({ isOpen: true })
    render(<Chatbot />)
    expect(screen.getByRole('dialog', { name: 'Assistente virtual da Unex' })).toBeInTheDocument()
    expect(screen.getByText('Olá! Como posso ajudar?')).toBeInTheDocument()
  })

  it('renderiza mensagens do histórico', () => {
    mockReturn({
      isOpen: true,
      messages: [
        { id: '1', role: 'user', text: 'Oi', timestamp: Date.now() },
        { id: '2', role: 'model', text: 'Olá, como posso ajudar?', timestamp: Date.now() },
      ],
    })
    render(<Chatbot />)
    expect(screen.getByText('Oi')).toBeInTheDocument()
    expect(screen.getByText('Olá, como posso ajudar?')).toBeInTheDocument()
  })

  it('envia mensagem ao submeter o formulário', async () => {
    const user = userEvent.setup()
    mockReturn({ isOpen: true })
    render(<Chatbot />)

    const input = screen.getByLabelText('Mensagem para o assistente')
    await user.type(input, 'Quais cursos?')
    await user.click(screen.getByLabelText('Enviar mensagem'))

    expect(mockSend).toHaveBeenCalledWith('Quais cursos?')
  })

  it('chama clearHistory ao clicar em limpar conversa', async () => {
    const user = userEvent.setup()
    mockReturn({
      isOpen: true,
      messages: [{ id: '1', role: 'user', text: 'Oi', timestamp: Date.now() }],
    })
    render(<Chatbot />)
    await user.click(screen.getByLabelText('Limpar conversa'))
    expect(mockClear).toHaveBeenCalled()
  })

  it('exibe indicador de digitação quando loading', () => {
    mockReturn({ isOpen: true, status: 'loading' })
    render(<Chatbot />)
    expect(screen.getByLabelText('Digitando')).toBeInTheDocument()
  })

  it('exibe erro quando houver falha', () => {
    mockReturn({ isOpen: true, error: 'falha de rede' })
    render(<Chatbot />)
    expect(screen.getByText('falha de rede')).toBeInTheDocument()
  })

  it('botão flutuante alterna estado ao clicar', async () => {
    const user = userEvent.setup()
    mockReturn({ isOpen: false })
    render(<Chatbot />)
    await user.click(screen.getByLabelText('Abrir assistente virtual'))
    expect(mockToggle).toHaveBeenCalled()
  })
})
