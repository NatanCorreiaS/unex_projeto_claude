import { Reveal } from './Reveal'

// Cabeçalho padrão de seção: rótulo curto em destaque, título e, opcionalmente,
// uma descrição de apoio. Usado por todas as seções de conteúdo da página.
interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  /** 'light' (padrão) é para seções com fundo claro; 'dark' ajusta as cores
   * de texto para permanecerem legíveis sobre fundos escuros (ex.: Depoimentos). */
  tone?: 'light' | 'dark'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'
  const eyebrowClasses =
    tone === 'dark'
      ? 'bg-white/10 text-magenta-100 ring-1 ring-white/20'
      : 'bg-magenta-50 text-magenta-600'
  const titleClasses = tone === 'dark' ? 'text-white' : 'text-navy-900'
  const descriptionClasses = tone === 'dark' ? 'text-slate-300' : 'text-slate-600'

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <span
        className={`inline-flex w-fit items-center rounded-full px-4 py-1 text-sm font-semibold tracking-wide uppercase ${eyebrowClasses}`}
      >
        {eyebrow}
      </span>
      <h2 className={`text-3xl font-semibold text-balance sm:text-4xl ${titleClasses}`}>{title}</h2>
      {description ? (
        <p className={`text-base sm:text-lg ${descriptionClasses}`}>{description}</p>
      ) : null}
    </Reveal>
  )
}
