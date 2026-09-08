import type { Testimonial } from '../types'

// Depoimentos de egressos exibidos na seção `Testimonials`. Conteúdo
// fictício representativo, a ser substituído por depoimentos reais.
export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Camila Ferraz',
    course: 'Medicina',
    graduationYear: 2023,
    quote:
      'A vivência prática desde o início do curso me deu confiança para atuar em um hospital de grande porte assim que me formei.',
    initials: 'CF',
  },
  {
    id: 'testimonial-2',
    name: 'Rodrigo Almeida',
    course: 'Sistemas de Informação',
    graduationYear: 2022,
    quote:
      'Os professores acompanham de perto o mercado de tecnologia. Consegui meu primeiro estágio ainda no terceiro semestre.',
    initials: 'RA',
  },
  {
    id: 'testimonial-3',
    name: 'Luana Sales',
    course: 'Direito',
    graduationYear: 2021,
    quote:
      'O núcleo de prática jurídica foi essencial para minha aprovação na OAB de primeira. Recomendo a estrutura da Unex.',
    initials: 'LS',
  },
]
