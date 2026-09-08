import { BookOpenCheck, HandHeart, Sparkles, Target } from 'lucide-react'
import { Reveal } from '../ui/Reveal'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

// Seção "Sobre a Unex": comunica a missão institucional através de pilares
// (missão, visão, valores, compromisso social), conforme pedido em
// `demandas.md`.
const PILLARS = [
  {
    icon: Target,
    title: 'Missão',
    description:
      'Formar profissionais capacitados e humanizados, com ensino de qualidade acessível a toda a região.',
  },
  {
    icon: Sparkles,
    title: 'Visão',
    description:
      'Ser referência em ensino superior no interior da Bahia, reconhecida pela excelência acadêmica.',
  },
  {
    icon: BookOpenCheck,
    title: 'Metodologia',
    description:
      'Ensino teórico-prático desde o primeiro semestre, com laboratórios, clínicas-escola e projetos reais.',
  },
  {
    icon: HandHeart,
    title: 'Compromisso social',
    description:
      'Programas de bolsas, atendimento gratuito à comunidade e ações de extensão em todas as unidades.',
  },
]

export function About() {
  return (
    <section id="sobre" className="bg-white py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Sobre a Unex"
          title="Ensino superior com propósito e proximidade"
          description="Há mais de três décadas formando profissionais na Bahia com uma proposta pedagógica que une teoria sólida, prática constante e cuidado com cada estudante."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.08}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-100 p-6 shadow-sm shadow-slate-100 transition-shadow hover:shadow-md">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <pillar.icon size={20} />
                </span>
                <h3 className="text-lg font-semibold text-navy-900">{pillar.title}</h3>
                <p className="text-sm text-slate-600">{pillar.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
