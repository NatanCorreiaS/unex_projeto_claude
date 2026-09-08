import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// Animação de entrada suave (fade + leve deslocamento vertical) disparada
// quando o elemento entra na viewport. Usado para dar movimento sutil às
// seções sem depender de bibliotecas extras como AOS.
interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
