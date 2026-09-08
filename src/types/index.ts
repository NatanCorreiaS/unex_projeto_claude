// Tipos compartilhados pelo conteúdo estático do site (cursos, unidades,
// depoimentos e notícias). Mantê-los centralizados evita duplicação de forma
// entre os arquivos de dados em `src/data` e os componentes que os consomem.

/** Níveis de graduação oferecidos pela Unex. */
export type CourseLevel = 'Bacharelado' | 'Licenciatura' | 'Tecnólogo'

/** Turnos de oferta de um curso. */
export type CourseShift = 'Matutino' | 'Vespertino' | 'Noturno' | 'EAD'

export interface Course {
  id: string
  name: string
  level: CourseLevel
  shifts: CourseShift[]
  durationInSemesters: number
  description: string
  /** Nome do ícone da biblioteca lucide-react usado como ilustração do card. */
  icon: string
}

export interface Unit {
  id: string
  city: string
  state: string
  address: string
  phone: string
}

export interface Testimonial {
  id: string
  name: string
  course: string
  graduationYear: number
  quote: string
  /** Iniciais usadas no avatar quando não há foto disponível. */
  initials: string
}

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
}

/** Estado de um campo de formulário controlado, com sua mensagem de erro. */
export interface FormFieldState {
  value: string
  error: string | null
}

export interface ContactFormValues {
  name: string
  email: string
  phone: string
  course: string
  message: string
}
