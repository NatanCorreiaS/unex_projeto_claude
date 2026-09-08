import type { ReactNode } from 'react'

// Wrapper de largura máxima e respiro lateral reutilizado por todas as
// seções, garantindo um grid consistente em qualquer tamanho de tela.
interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  )
}
