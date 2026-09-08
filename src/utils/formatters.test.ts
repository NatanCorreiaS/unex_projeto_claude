import { describe, expect, it } from 'vitest'
import { formatDateBr, formatPhoneBr } from './formatters'

describe('formatPhoneBr', () => {
  it('retorna string vazia para entrada vazia', () => {
    expect(formatPhoneBr('')).toBe('')
  })

  it('formata progressivamente enquanto o usuário digita', () => {
    expect(formatPhoneBr('75')).toBe('(75')
    expect(formatPhoneBr('7530')).toBe('(75) 30')
  })

  it('formata telefone fixo completo (10 dígitos)', () => {
    expect(formatPhoneBr('7530001000')).toBe('(75) 3000-1000')
  })

  it('formata celular completo (11 dígitos)', () => {
    expect(formatPhoneBr('75988887777')).toBe('(75) 98888-7777')
  })

  it('ignora caracteres não numéricos e trunca em 11 dígitos', () => {
    expect(formatPhoneBr('(75) 98888-7777 extra')).toBe('(75) 98888-7777')
  })
})

describe('formatDateBr', () => {
  it('formata data ISO por extenso em português', () => {
    expect(formatDateBr('2026-08-20')).toBe('20 de agosto de 2026')
  })
})
