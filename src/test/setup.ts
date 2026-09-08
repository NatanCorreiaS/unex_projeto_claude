// Configuração global do Vitest: registra os matchers do jest-dom
// (ex.: `toBeInTheDocument`) para os testes de componentes com Testing Library.
import '@testing-library/jest-dom/vitest'

// jsdom não implementa IntersectionObserver, usado pelas animações
// `whileInView` do framer-motion (componente `Reveal`). Um stub mínimo
// evita que os testes de componentes que renderizam `Reveal` quebrem.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
  // @ts-expect-error stub simplificado o suficiente para os testes
  globalThis.IntersectionObserver = IntersectionObserverStub
}
