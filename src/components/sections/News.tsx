import { ArrowUpRight } from 'lucide-react'
import { news } from '../../data/news'
import { formatDateBr } from '../../utils/formatters'
import { Reveal } from '../ui/Reveal'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

// Seção de notícias/blog institucional, a partir de `src/data/news.ts`. As
// datas ISO são formatadas por extenso com `formatDateBr`.
export function News() {
  return (
    <section id="noticias" className="bg-slate-50 py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Blog & notícias"
          title="Últimas novidades da Unex"
          description="Fique por dentro de vestibulares, eventos acadêmicos e conquistas da nossa comunidade."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {news.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <a
                href="#noticias"
                className="group flex h-full flex-col gap-4 rounded-2xl bg-white p-7 ring-1 ring-slate-100 transition-shadow hover:shadow-lg hover:shadow-slate-200/70"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-azure-50 px-3 py-1 text-xs font-semibold text-azure-600">
                    {item.category}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-magenta-500"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-semibold text-navy-900">{item.title}</h3>
                <p className="grow text-sm text-slate-600">{item.excerpt}</p>
                <time dateTime={item.date} className="text-xs font-medium text-slate-400">
                  {formatDateBr(item.date)}
                </time>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
