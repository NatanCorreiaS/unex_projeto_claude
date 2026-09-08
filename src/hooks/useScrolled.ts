import { useEffect, useState } from 'react'

// Indica se a página já rolou além de `threshold` pixels, usado pela
// `Navbar` para trocar de um fundo transparente (sobre o Hero) para um fundo
// sólido conforme o usuário navega.
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(() =>
    typeof window === 'undefined' ? false : window.scrollY > threshold,
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return scrolled
}
