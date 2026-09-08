import { units } from '../../data/units'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from '../ui/SocialIcons'

// Rodapé institucional: reforça a marca, replica a navegação principal,
// lista as unidades físicas e traz redes sociais/informações legais básicas.
const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon },
] as const

const FOOTER_LINKS = [
  { id: 'sobre', label: 'Sobre a Unex' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'noticias', label: 'Notícias' },
  { id: 'contato', label: 'Fale conosco' },
] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-slate-300">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo variant="light" />
          <p className="max-w-xs text-sm text-slate-400">
            Instituição de ensino superior comprometida com a formação de profissionais
            preparados para transformar o mercado de trabalho.
          </p>
          <div className="flex gap-3 pt-2">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-magenta-500"
              >
                <Icon width={18} height={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Navegação</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="transition-colors hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-2">
          <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Unidades</h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {units.map((unit) => (
              <li key={unit.id} className="text-sm">
                <p className="font-medium text-white">
                  {unit.city} — {unit.state}
                </p>
                <p className="text-slate-400">{unit.address}</p>
                <p className="text-slate-400">{unit.phone}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>© {year} Unex — Todos os direitos reservados.</p>
          <p>Projeto de refatoração de UI — protótipo institucional não oficial.</p>
        </Container>
      </div>
    </footer>
  )
}
