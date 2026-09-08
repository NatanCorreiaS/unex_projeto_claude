import { describe, expect, it } from 'vitest'
import { hasMinLength, isRequired, isValidBrPhone, isValidEmail } from './validators'

describe('isRequired', () => {
  it('retorna false para string vazia ou só com espaços', () => {
    expect(isRequired('')).toBe(false)
    expect(isRequired('   ')).toBe(false)
  })

  it('retorna true quando há conteúdo além de espaços', () => {
    expect(isRequired('  Ana  ')).toBe(true)
  })
})

describe('isValidEmail', () => {
  it('aceita e-mails bem formados', () => {
    expect(isValidEmail('aluno@unex.edu.br')).toBe(true)
    expect(isValidEmail('  aluno@unex.edu.br  ')).toBe(true)
  })

  it('rejeita e-mails sem @, domínio ou com espaços', () => {
    expect(isValidEmail('aluno-unex.edu.br')).toBe(false)
    expect(isValidEmail('aluno@unex')).toBe(false)
    expect(isValidEmail('aluno @unex.edu.br')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('isValidBrPhone', () => {
  it('aceita telefones fixos (10 dígitos) e celulares (11 dígitos)', () => {
    expect(isValidBrPhone('7530001000')).toBe(true)
    expect(isValidBrPhone('75988887777')).toBe(true)
  })

  it('aceita números já formatados com máscara', () => {
    expect(isValidBrPhone('(75) 98888-7777')).toBe(true)
  })

  it('rejeita quantidades de dígitos inválidas', () => {
    expect(isValidBrPhone('123')).toBe(false)
    expect(isValidBrPhone('')).toBe(false)
  })
})

describe('hasMinLength', () => {
  it('respeita o mínimo de caracteres úteis, ignorando espaços nas bordas', () => {
    expect(hasMinLength('  oi  ', 3)).toBe(false)
    expect(hasMinLength('  mensagem  ', 3)).toBe(true)
  })
})
