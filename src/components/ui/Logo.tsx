// Marca da Unex: mesmo símbolo "X" observado no sistema acadêmico em
// `references/unex.png`, reconstruído em SVG (leve e nítido em qualquer
// resolução) seguido do nome por extenso.
interface LogoProps {
  variant?: 'light' | 'dark'
  className?: string
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const wordmarkColor = variant === 'light' ? 'text-white' : 'text-navy-900'

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        role="img"
        aria-label="Símbolo da Unex"
      >
        <rect width="34" height="34" rx="9" fill="#0b0f34" />
        <path
          d="M9 9L25 25M25 9L9 25"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-display text-xl font-semibold tracking-tight ${wordmarkColor}`}>
        unex
      </span>
    </span>
  )
}
