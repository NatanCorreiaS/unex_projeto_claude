import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('exibe mensagens de erro ao tentar enviar o formulário vazio', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: /enviar mensagem/i }))

    expect(await screen.findByText(/informe seu nome completo/i)).toBeInTheDocument()
    expect(screen.getByText(/informe um e-mail válido/i)).toBeInTheDocument()
  })

  it('envia o formulário com sucesso quando todos os campos são válidos', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText(/nome completo/i), 'Ana Souza')
    await user.type(screen.getByLabelText(/^e-mail$/i), 'ana@example.com')
    await user.type(screen.getByLabelText(/telefone/i), '75988887777')
    await user.selectOptions(screen.getByLabelText(/curso de interesse/i), 'Medicina')
    await user.type(
      screen.getByLabelText(/mensagem/i),
      'Gostaria de mais informações sobre o curso de Medicina.',
    )

    await user.click(screen.getByRole('button', { name: /enviar mensagem/i }))

    expect(
      await screen.findByText(/mensagem enviada! em breve entraremos em contato/i),
    ).toBeInTheDocument()
  })
})
