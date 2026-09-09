# Unex — Refatoração do site institucional

Proposta de refatoração visual do site institucional da Unex (instituição
privada de ensino superior), com uma arquitetura moderna, responsiva e
mais intuitiva que a versão atual. Ver `references/demandas.md` para o
escopo original e `references/` para as imagens de referência de marca.

## Tecnologias

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (com o React Compiler habilitado)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://motion.dev/) para as animações de entrada por seção
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) para os testes

## Estrutura

```
src/
  components/
    layout/     Navbar e Footer
    sections/   Hero, About, Courses, Testimonials, Units, News, ContactForm
    ui/         Átomos reutilizáveis (Button, Container, Reveal, ...)
  data/         Conteúdo estático (cursos, unidades, depoimentos, notícias)
  hooks/        Lógica de estado/efeitos reutilizável (formulário, scroll, etc.)
  utils/        Funções puras de validação e formatação
  types/        Tipos compartilhados
```

Cada arquivo de lógica (`utils`, `hooks`) tem um arquivo `*.test.ts(x)`
correspondente ao lado.

## Rodando localmente

```bash
npm install
# Front + back separados (recomendado em dev)
npm run dev              # Vite (http://localhost:5173) com proxy /api -> 3001
npm run dev:server       # Express + Gemini (http://localhost:3001)
npm run dev:all          # ambos juntos (concurrently)

# Produção local — Express serve o build do Vite
npm run build:all        # build front (dist/) + back (server/dist/)
npm run start            # ou npm run serve — Express em :3001 servindo dist/
# Variáveis: GEMINI_API_KEY (obrigatória no servidor) em .env ou env; PORT opcional

npm run test             # roda a suíte de testes uma vez
npm run test:watch
npm run lint
```

## Deploy no GitHub Pages

O workflow em `.github/workflows/deploy.yml` builda e publica o conteúdo
de `dist/` no GitHub Pages a cada push na branch `main` (também pode ser
disparado manualmente). Para habilitar:

1. No repositório no GitHub, vá em **Settings → Pages** e selecione a
   fonte **GitHub Actions**.
2. Dê push na branch `main` — o workflow builda e publica automaticamente.

O `vite.config.ts` usa `base: './'` (caminhos relativos), então o build
funciona tanto em `usuario.github.io/nome-do-repo` quanto na raiz de um
domínio próprio, sem precisar configurar o nome do repositório.

## Privacidade

O formulário de contato (`src/components/sections/ContactForm.tsx`) não
possui backend neste projeto: o envio é simulado no cliente
(`simulateSubmit`), e nenhum dado do usuário é armazenado ou transmitido
a terceiros. Para uso em produção, substitua por uma integração real.
