import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useContactForm, validateContactForm } from './useContactForm'

const validValues = {
  name: 'Ana Souza',
  email: 'ana@example.com',
  phone: '75988887777',
  course: 'Medicina',
  message: 'Gostaria de mais informações sobre o curso.',
}

describe('validateContactForm', () => {
  it('não retorna erros para valores válidos', () => {
    expect(validateContactForm(validValues)).toEqual({})
  })

  it('retorna erro para campos obrigatórios vazios', () => {
    const errors = validateContactForm({
      name: '',
      email: 'invalido',
      phone: '123',
      course: '',
      message: 'curta',
    })
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.phone).toBeDefined()
    expect(errors.course).toBeDefined()
    expect(errors.message).toBeDefined()
  })
})

describe('useContactForm', () => {
  it('aplica máscara ao telefone conforme o usuário digita', () => {
    const { result } = renderHook(() => useContactForm())

    act(() => {
      result.current.handleChange('phone', '75988887777')
    })

    expect(result.current.values.phone).toBe('(75) 98888-7777')
  })

  it('bloqueia o envio e expõe erros quando o formulário é inválido', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useContactForm({ onSubmit }))

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.status).toBe('error')
    expect(result.current.errors.name).toBeDefined()
  })

  it('envia os valores e reseta o formulário em caso de sucesso', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useContactForm({ onSubmit }))

    act(() => {
      result.current.handleChange('name', validValues.name)
      result.current.handleChange('email', validValues.email)
      result.current.handleChange('phone', validValues.phone)
      result.current.handleChange('course', validValues.course)
      result.current.handleChange('message', validValues.message)
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(onSubmit).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.values.name).toBe('')
  })
})
