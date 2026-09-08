import { Quote } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import { Reveal } from '../ui/Reveal'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

// Seção de depoimentos de ex-alunos, exibida como uma grade de cards com
// citação, conforme `src/data/testimonials.ts`.
export function Testimonials() {
  return (
    <section id="depoimentos" className="bg-navy-950 py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem estudou na Unex, recomenda"
          description="Histórias reais de estudantes que construíram carreira a partir da formação recebida aqui."
          align="center"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.1}>
              <figure className="flex h-full flex-col gap-5 rounded-2xl bg-white/5 p-7 ring-1 ring-white/10">
                <Quote className="text-magenta-400" size={28} aria-hidden="true" />
                <blockquote className="grow text-sm leading-relaxed text-slate-200">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-magenta-500 text-sm font-semibold text-white">
                    {testimonial.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">
                      {testimonial.course} · {testimonial.graduationYear}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
