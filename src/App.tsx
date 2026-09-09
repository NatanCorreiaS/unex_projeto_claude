import { Chatbot } from './components/chatbot/Chatbot'
import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { About } from './components/sections/About'
import { ContactForm } from './components/sections/ContactForm'
import { Courses } from './components/sections/Courses'
import { Hero } from './components/sections/Hero'
import { News } from './components/sections/News'
import { Testimonials } from './components/sections/Testimonials'
import { Units } from './components/sections/Units'

// Componente raiz: monta a página institucional de ponta a ponta,
// combinando o cabeçalho fixo (`Navbar`), as seções de conteúdo definidas em
// `references/demandas.md` e o rodapé (`Footer`).
function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Courses />
        <Testimonials />
        <Units />
        <News />
        <ContactForm />
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}

export default App
