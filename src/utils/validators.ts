// Funções puras de validação usadas pelo formulário de contato
// (`ContactForm` / `useContactForm`). Isoladas em um módulo próprio para
// serem testadas independentemente da camada de UI.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Verifica se uma string não está vazia (ignorando espaços nas bordas). */
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

/** Verifica se o e-mail tem o formato `usuario@dominio.tld`. */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

/**
 * Verifica se um telefone brasileiro é válido, aceitando tanto o valor já
 * formatado (com máscara) quanto apenas os dígitos. Considera válidos
 * números fixos (10 dígitos, DDD + 8) e celulares (11 dígitos, DDD + 9).
 */
export function isValidBrPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 || digits.length === 11
}

/** Verifica se um texto respeita um comprimento mínimo de caracteres úteis. */
export function hasMinLength(value: string, min: number): boolean {
  return value.trim().length >= min
}
