import { MapPin, Phone } from 'lucide-react'
import { units } from '../../data/units'
import { Reveal } from '../ui/Reveal'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

// Seção de unidades físicas da Unex (Feira de Santana, Itabuna, Jequié e
// Vitória da Conquista), a partir de `src/data/units.ts`.
export function Units() {
  return (
    <section id="unidades" className="bg-white py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Onde estamos"
          title="Quatro unidades espalhadas pela Bahia"
          description="Estude perto de casa com a mesma estrutura e qualidade de ensino em qualquer campus."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {units.map((unit, index) => (
            <Reveal key={unit.id} delay={index * 0.08}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-navy-900">
                  {unit.city}
                  <span className="ml-1 text-sm font-medium text-slate-400">{unit.state}</span>
                </h3>
                <p className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-magenta-500" aria-hidden="true" />
                  {unit.address}
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={16} className="shrink-0 text-magenta-500" aria-hidden="true" />
                  {unit.phone}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
