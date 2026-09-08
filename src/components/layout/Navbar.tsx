import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrolled } from '../../hooks/useScrolled'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

// Cabeçalho fixo do site com navegação por âncoras. Alterna entre um fundo
// transparente (sobre o Hero) e sólido conforme a rolagem (`useScrolled`) e
// destaca o link da seção visível no momento (`useActiveSection`). Inclui um
// menu responsivo para telas pequenas, conforme exigido em `demandas.md`.

const NAV_LINKS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'unidades', label: 'Unidades' },
  { id: 'noticias', label: 'Notícias' },
] as const

export function Navbar() {
  const scrolled = useScrolled()
  const activeId = useActiveSection(NAV_LINKS.map((link) => link.id))
  const [isOpen, setIsOpen] = useState(false)

  const solid = scrolled || isOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'bg-white/95 shadow-sm backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <a href="#topo" className="shrink-0">
          <Logo variant={solid ? 'dark' : 'light'} />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={activeId === link.id ? 'true' : undefined}
              className={`text-sm font-medium transition-colors ${
                solid ? 'text-slate-600 hover:text-navy-900' : 'text-white/85 hover:text-white'
              } ${activeId === link.id ? (solid ? '!text-magenta-600' : '!text-white') : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#contato" variant="primary">
            Inscreva-se
          </Button>
        </div>

        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-full p-2 lg:hidden ${
            solid ? 'text-navy-900' : 'text-white'
          }`}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </Container>

      {isOpen ? (
        <nav
          className="flex flex-col gap-1 border-t border-slate-100 bg-white px-6 py-4 lg:hidden"
          aria-label="Navegação principal (mobile)"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setIsOpen(false)}
              className={`rounded-lg px-3 py-3 text-base font-medium ${
                activeId === link.id ? 'bg-magenta-50 text-magenta-600' : 'text-slate-700'
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button href="#contato" variant="primary" className="mt-3 justify-center" onClick={() => setIsOpen(false)}>
            Inscreva-se
          </Button>
        </nav>
      ) : null}
    </header>
  )
}
