import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

// Botão de ação padrão do site, com variantes de estilo reutilizadas em
// CTAs (hero, cursos, formulário) e no rodapé. Pode renderizar como <a> ao
// receber `href`, ou como <button> caso contrário.
type Variant = 'primary' | 'secondary' | 'ghost'

interface CommonProps {
  variant?: Variant
  className?: string
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-magenta-500 text-white shadow-lg shadow-magenta-500/25 hover:bg-magenta-600',
  secondary:
    'bg-white text-navy-900 shadow-lg shadow-navy-900/10 hover:bg-slate-50',
  ghost: 'bg-transparent text-white ring-1 ring-white/40 hover:bg-white/10',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta-500 disabled:pointer-events-none disabled:opacity-60'

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as ButtonAsAnchor
    return (
      <a href={href} className={classes} {...anchorProps}>
        {props.children}
      </a>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button type="button" className={classes} {...buttonProps}>
      {buttonProps.children}
    </button>
  )
}
