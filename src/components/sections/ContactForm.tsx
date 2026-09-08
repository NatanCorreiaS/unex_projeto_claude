import { CheckCircle2, Loader2, Send } from 'lucide-react'
import type { ReactNode } from 'react'
import { courses } from '../../data/courses'
import { useContactForm } from '../../hooks/useContactForm'
import type { ContactFormValues } from '../../types'
import { Reveal } from '../ui/Reveal'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

// Formulário de contato / captação de lead. Não há backend próprio neste
// projeto estático: `simulateSubmit` apenas representa o envio para fins de
// demonstração. Em produção, substitua por uma integração real (API própria
// ou serviço de formulários) — nenhum dado é armazenado ou enviado a
// terceiros nesta versão, em linha com a diretriz de privacidade do projeto.
async function simulateSubmit(_values: ContactFormValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 900))
}

const inputClasses =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-slate-400 transition-colors focus:border-magenta-500 focus:ring-2 focus:ring-magenta-500/20 focus:outline-none'

export function ContactForm() {
  const { values, errors, status, handleChange, handleSubmit } = useContactForm({
    onSubmit: simulateSubmit,
  })

  const isSubmitting = status === 'submitting'

  return (
    <section id="contato" className="bg-white py-24">
      <Container className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          align="left"
          eyebrow="Fale conosco"
          title="Pronto para dar o próximo passo?"
          description="Preencha seus dados e um dos nossos consultores acadêmicos entra em contato para te ajudar com a inscrição, bolsas e formas de pagamento."
        />

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nome completo" htmlFor="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={inputClasses}
                  value={values.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  placeholder="Seu nome"
                />
              </Field>

              <Field label="E-mail" htmlFor="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={inputClasses}
                  value={values.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  placeholder="voce@email.com"
                />
              </Field>

              <Field label="Telefone" htmlFor="phone" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  className={inputClasses}
                  value={values.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  placeholder="(75) 90000-0000"
                />
              </Field>

              <Field label="Curso de interesse" htmlFor="course" error={errors.course}>
                <select
                  id="course"
                  name="course"
                  className={inputClasses}
                  value={values.course}
                  onChange={(event) => handleChange('course', event.target.value)}
                  aria-invalid={Boolean(errors.course)}
                >
                  <option value="">Selecione um curso</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Mensagem" htmlFor="message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                rows={4}
                className={`${inputClasses} resize-none`}
                value={values.message}
                onChange={(event) => handleChange('message', event.target.value)}
                aria-invalid={Boolean(errors.message)}
                placeholder="Conte um pouco sobre o que você gostaria de saber"
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-magenta-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-magenta-500/25 transition-transform hover:-translate-y-0.5 hover:bg-magenta-600 disabled:pointer-events-none disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Enviar mensagem
                </>
              )}
            </button>

            <div role="status" aria-live="polite">
              {status === 'success' ? (
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <CheckCircle2 size={18} />
                  Mensagem enviada! Em breve entraremos em contato.
                </p>
              ) : null}
            </div>
          </form>
        </Reveal>
      </Container>
    </section>
  )
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
