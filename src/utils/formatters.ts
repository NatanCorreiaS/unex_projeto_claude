// Funções puras de formatação de texto usadas pelo formulário de contato e
// pela seção de notícias.

/**
 * Aplica a máscara de telefone brasileiro `(DD) NNNNN-NNNN` (celular) ou
 * `(DD) NNNN-NNNN` (fixo) progressivamente, conforme o usuário digita.
 * Aceita tanto entrada já formatada quanto apenas dígitos.
 */
export function formatPhoneBr(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`

  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)

  if (rest.length <= 4) return `(${ddd}) ${rest}`

  // Celular tem 9 dígitos após o DDD; fixo tem 8.
  const splitIndex = digits.length > 10 ? 5 : 4
  const firstPart = rest.slice(0, splitIndex)
  const secondPart = rest.slice(splitIndex)

  return secondPart ? `(${ddd}) ${firstPart}-${secondPart}` : `(${ddd}) ${firstPart}`
}

/** Formata uma data ISO (`AAAA-MM-DD`) por extenso em português do Brasil. */
export function formatDateBr(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
