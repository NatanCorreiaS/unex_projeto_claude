import type { NewsItem } from '../types'

// Notícias/posts de blog institucional exibidos na seção `News`. Conteúdo
// ilustrativo, pensado para ser futuramente alimentado por um CMS.
export const news: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Unex abre inscrições para o vestibular de verão 2026',
    excerpt:
      'Processo seletivo oferece bolsas de até 100% para os primeiros colocados em todos os cursos de graduação.',
    date: '2026-08-20',
    category: 'Vestibular',
  },
  {
    id: 'news-2',
    title: 'Nova clínica-escola de Odontologia é inaugurada em Itabuna',
    excerpt:
      'Espaço amplia o atendimento gratuito à comunidade e oferece mais vagas de estágio supervisionado.',
    date: '2026-07-12',
    category: 'Infraestrutura',
  },
  {
    id: 'news-3',
    title: 'Alunos da Unex se destacam em maratona de programação regional',
    excerpt:
      'Equipe de Sistemas de Informação conquistou o segundo lugar entre 40 instituições participantes.',
    date: '2026-06-30',
    category: 'Vida acadêmica',
  },
]
