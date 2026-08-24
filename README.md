# nextjs-base-template

Template base para arrancar proyectos con Next.js (App Router) con la configuración
y herramientas más usadas ya listas.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io) (con `prettier-plugin-tailwindcss`)
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) para tests unitarios/integración
- [Playwright](https://playwright.dev) para tests e2e
- [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) + [commitlint](https://commitlint.js.org) (Conventional Commits)

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io)

## Empezar

```bash
pnpm install
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts

| Script              | Descripción                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Levanta el servidor de desarrollo                                                           |
| `pnpm build`        | Build de producción                                                                         |
| `pnpm start`        | Sirve el build de producción                                                                |
| `pnpm lint`         | Corre ESLint                                                                                |
| `pnpm format`       | Formatea el proyecto con Prettier                                                           |
| `pnpm format:check` | Verifica el formateo sin escribir cambios                                                   |
| `pnpm test`         | Corre los tests unitarios/integración (Vitest)                                              |
| `pnpm test:watch`   | Corre Vitest en modo watch                                                                  |
| `pnpm test:e2e`     | Corre los tests e2e con Playwright (requiere `pnpm exec playwright install` la primera vez) |

## Estructura de carpetas

```
src/
  app/         # rutas de Next.js (App Router)
  components/  # componentes compartidos
  lib/         # utilidades y helpers
  hooks/       # custom hooks de React
  types/       # tipos compartidos
e2e/           # tests e2e de Playwright
```

Los tests unitarios/integración se co-locan junto al archivo que prueban
(`Component.tsx` + `Component.test.tsx`).

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá los valores necesarios.

## Commits

Los mensajes de commit siguen [Conventional Commits](https://www.conventionalcommits.org)
(`feat: ...`, `fix: ...`, `chore: ...`, etc.) y se validan automáticamente con
commitlint en el hook `commit-msg`. El hook `pre-commit` corre lint-staged
(ESLint + Prettier sobre los archivos en stage).
