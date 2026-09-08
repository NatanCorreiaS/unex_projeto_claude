import type { Course } from '../types'

// Catálogo estático dos principais cursos de graduação da Unex, exibido pela
// seção `Courses`. Em uma futura integração com um CMS ou API institucional,
// este arquivo pode ser substituído por uma chamada de rede mantendo o mesmo
// formato de `Course`.
export const courses: Course[] = [
  {
    id: 'medicina',
    name: 'Medicina',
    level: 'Bacharelado',
    shifts: ['Matutino', 'Vespertino'],
    durationInSemesters: 12,
    description:
      'Formação médica completa, com corpo docente experiente e estágios em hospitais e clínicas parceiras desde os primeiros semestres.',
    icon: 'Stethoscope',
  },
  {
    id: 'direito',
    name: 'Direito',
    level: 'Bacharelado',
    shifts: ['Matutino', 'Noturno'],
    durationInSemesters: 10,
    description:
      'Base sólida em ciências jurídicas com núcleo de prática forense e preparação orientada para OAB.',
    icon: 'Scale',
  },
  {
    id: 'odontologia',
    name: 'Odontologia',
    level: 'Bacharelado',
    shifts: ['Matutino', 'Vespertino'],
    durationInSemesters: 10,
    description:
      'Clínicas-escola equipadas e vivência prática constante para formar profissionais prontos para o mercado.',
    icon: 'Smile',
  },
  {
    id: 'enfermagem',
    name: 'Enfermagem',
    level: 'Bacharelado',
    shifts: ['Matutino', 'Noturno'],
    durationInSemesters: 8,
    description:
      'Formação humanizada com forte carga prática em unidades de saúde da rede pública e privada.',
    icon: 'HeartPulse',
  },
  {
    id: 'engenharia-civil',
    name: 'Engenharia Civil',
    level: 'Bacharelado',
    shifts: ['Noturno'],
    durationInSemesters: 10,
    description:
      'Projeto pedagógico voltado à inovação e sustentabilidade, com laboratórios de estruturas e materiais.',
    icon: 'Building2',
  },
  {
    id: 'psicologia',
    name: 'Psicologia',
    level: 'Bacharelado',
    shifts: ['Matutino', 'Noturno'],
    durationInSemesters: 10,
    description:
      'Abordagem multidisciplinar com estágios supervisionados em clínica, escola e saúde coletiva.',
    icon: 'Brain',
  },
  {
    id: 'sistemas-de-informacao',
    name: 'Sistemas de Informação',
    level: 'Bacharelado',
    shifts: ['Noturno', 'EAD'],
    durationInSemesters: 8,
    description:
      'Formação em desenvolvimento de software, dados e gestão de TI alinhada às demandas do mercado digital.',
    icon: 'Cpu',
  },
  {
    id: 'administracao',
    name: 'Administração',
    level: 'Bacharelado',
    shifts: ['Matutino', 'Noturno', 'EAD'],
    durationInSemesters: 8,
    description:
      'Visão estratégica de negócios com ênfase em empreendedorismo, finanças e gestão de pessoas.',
    icon: 'Briefcase',
  },
]
