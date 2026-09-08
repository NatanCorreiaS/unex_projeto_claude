import type { SVGProps } from 'react'

// Ícones de redes sociais desenhados como SVG inline. A versão instalada do
// lucide-react não inclui mais logotipos de marcas (apenas ícones
// genéricos), então estes glifos simplificados substituem o conjunto usado
// no rodapé (`Footer`).
type IconProps = SVGProps<SVGSVGElement>

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M14 8.5h2.5V5H14c-2.2 0-4 1.8-4 4v2H8v3.5h2V21h3.5v-6.5H16l.6-3.5h-3.1V9c0-.6.4-.5 1-.5Z" />
    </svg>
  )
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8.5" r="0.6" fill="currentColor" />
      <path d="M8 11v6M12 17v-4c0-1.4 1-2.2 2.2-2.2S16 11.6 16 13v4M12 11v.5" />
    </svg>
  )
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.8v4.4l3.8-2.2-3.8-2.2Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
