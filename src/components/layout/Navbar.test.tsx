import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('mantém o menu mobile fechado por padrão', () => {
    render(<Navbar />)
    expect(screen.queryByLabelText(/navegação principal \(mobile\)/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /abrir menu/i })).toBeInTheDocument()
  })

  it('abre e fecha o menu mobile ao clicar no botão', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    await user.click(screen.getByRole('button', { name: /abrir menu/i }))
    expect(screen.getByLabelText(/navegação principal \(mobile\)/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /fechar menu/i }))
    expect(screen.queryByLabelText(/navegação principal \(mobile\)/i)).not.toBeInTheDocument()
  })
})
