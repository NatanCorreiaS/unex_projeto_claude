import {
  Briefcase,
  Building2,
  Brain,
  Cpu,
  HeartPulse,
  Scale,
  Smile,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'
import { courses } from '../../data/courses'
import { Reveal } from '../ui/Reveal'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

// Seção de cursos: grade de cards a partir de `src/data/courses.ts`. O nome
// do ícone salvo em cada curso é resolvido através de `ICONS`, um mapa
// fechado de ícones do lucide-react (evita importar a biblioteca inteira
// dinamicamente por string).
const ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  Scale,
  Smile,
  HeartPulse,
  Building2,
  Brain,
  Cpu,
  Briefcase,
}

export function Courses() {
  return (
    <section id="cursos" className="bg-slate-50 py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Graduações"
          title="Cursos para transformar sua trajetória"
          description="Áreas da saúde, exatas, humanas e negócios com forte vivência prática e professores atuantes no mercado."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => {
            const Icon = ICONS[course.icon] ?? Briefcase
            return (
              <Reveal key={course.id} delay={(index % 3) * 0.08}>
                <article className="group flex h-full flex-col gap-4 rounded-2xl bg-white p-7 ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-magenta-50 text-magenta-600 transition-colors group-hover:bg-magenta-500 group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-900">{course.name}</h3>
                    <p className="mt-1 text-sm font-medium text-azure-600">
                      {course.level} · {course.durationInSemesters} semestres
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">{course.description}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                    {course.shifts.map((shift) => (
                      <li
                        key={shift}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {shift}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
