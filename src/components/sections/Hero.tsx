import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

// Seção de abertura da página: chamada principal para vestibular, ENEM e
// transferência, conforme demanda do briefing. Usa um degradê inspirado no
// azul-marinho da identidade da Unex, com formas decorativas em CSS puro
// (sem imagens externas) para manter o carregamento leve.
const STATS = [
  { value: '30+', label: 'anos de história' },
  { value: '4', label: 'unidades na Bahia' },
  { value: '20 mil+', label: 'alunos formados' },
]

export function Hero() {
  return (
    <section
      id="topo"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-navy-950 pt-28 pb-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--color-navy-600)_0%,_var(--color-navy-950)_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-20 -z-10 h-96 w-96 rounded-full bg-magenta-500/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-azure-500/20 blur-3xl"
      />

      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/20">
            <GraduationCap size={16} />
            Inscrições abertas — Vestibular, ENEM e Transferência
          </span>

          <h1 className="text-4xl leading-[1.08] font-semibold text-white sm:text-5xl lg:text-6xl">
            Construa o futuro que você imagina na Unex
          </h1>

          <p className="max-w-xl text-lg text-slate-300">
            Graduações reconhecidas pelo MEC, infraestrutura completa e professores que
            acompanham cada etapa da sua formação — do primeiro semestre ao mercado de
            trabalho.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button href="#contato" variant="primary">
              Fazer minha inscrição
              <ArrowRight size={18} />
            </Button>
            <Button href="#cursos" variant="ghost">
              Conhecer os cursos
            </Button>
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  {stat.value}
                </dd>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
          className="relative hidden aspect-square w-full items-center justify-center lg:flex"
        >
          <div className="absolute inset-8 rounded-[2.5rem] bg-white/5 ring-1 ring-white/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="260" height="260" viewBox="0 0 34 34" role="presentation" aria-hidden="true">
              <rect width="34" height="34" rx="9" fill="url(#hero-gradient)" />
              <path
                d="M9 9L25 25M25 9L9 25"
                stroke="white"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="hero-gradient" x1="0" y1="0" x2="34" y2="34">
                  <stop offset="0%" stopColor="#e01571" />
                  <stop offset="100%" stopColor="#2f74e0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
