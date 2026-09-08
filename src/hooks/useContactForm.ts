import { useCallback, useState } from 'react'
import type { ContactFormValues } from '../types'
import { formatPhoneBr } from '../utils/formatters'
import { hasMinLength, isRequired, isValidBrPhone, isValidEmail } from '../utils/validators'

// Hook que controla o estado, a validação e o envio do formulário de
// contato/captação de lead (`ContactForm`). Mantém a lógica de negócio fora
// do componente de UI para facilitar testes e reutilização.

export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error'

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  course: '',
  message: '',
}

/** Valida todos os campos do formulário e retorna um mapa de erros. */
export function validateContactForm(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {}

  if (!isRequired(values.name)) {
    errors.name = 'Informe seu nome completo.'
  }
  if (!isValidEmail(values.email)) {
    errors.email = 'Informe um e-mail válido.'
  }
  if (!isValidBrPhone(values.phone)) {
    errors.phone = 'Informe um telefone válido com DDD.'
  }
  if (!isRequired(values.course)) {
    errors.course = 'Selecione um curso de interesse.'
  }
  if (!hasMinLength(values.message, 10)) {
    errors.message = 'Conte um pouco mais (mínimo de 10 caracteres).'
  }

  return errors
}

interface UseContactFormOptions {
  /**
   * Função chamada com os valores validados no envio. Por padrão simula uma
   * chamada de rede, já que este site estático não possui backend próprio —
   * em produção deve ser substituída pela integração real (API, e-mail
   * transacional ou serviço de formulários).
   */
  onSubmit?: (values: ContactFormValues) => Promise<void>
}

export function useContactForm({ onSubmit }: UseContactFormOptions = {}) {
  const [values, setValues] = useState<ContactFormValues>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<ContactFormStatus>('idle')

  const handleChange = useCallback(
    (field: keyof ContactFormValues, rawValue: string) => {
      const value = field === 'phone' ? formatPhoneBr(rawValue) : rawValue
      setValues((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    },
    [],
  )

  const handleSubmit = useCallback(
    async (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.()

      const validationErrors = validateContactForm(values)
      setErrors(validationErrors)

      if (Object.keys(validationErrors).length > 0) {
        setStatus('error')
        return
      }

      setStatus('submitting')
      try {
        if (onSubmit) {
          await onSubmit(values)
        }
        setStatus('success')
        setValues(initialValues)
      } catch {
        setStatus('error')
      }
    },
    [values, onSubmit],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setStatus('idle')
  }, [])

  return { values, errors, status, handleChange, handleSubmit, reset }
}
