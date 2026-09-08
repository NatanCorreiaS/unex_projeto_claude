import { Reveal } from './Reveal'

// Cabeçalho padrão de seção: rótulo curto em destaque, título e, opcionalmente,
// uma descrição de apoio. Usado por todas as seções de conteúdo da página.
interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <span className="inline-flex w-fit items-center rounded-full bg-magenta-50 px-4 py-1 text-sm font-semibold tracking-wide text-magenta-600 uppercase">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold text-balance sm:text-4xl">{title}</h2>
      {description ? (
        <p className="text-base text-slate-600 sm:text-lg">{description}</p>
      ) : null}
    </Reveal>
  )
}
