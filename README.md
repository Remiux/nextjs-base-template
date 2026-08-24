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
- [Changesets](https://github.com/changesets/changesets) para versionado semántico y `CHANGELOG.md`
- [Dependabot](https://docs.github.com/code-security/dependabot) para actualizar dependencias automáticamente

## Requisitos

- Node.js 22.22.2+, 24.15.0+ o 26+ (requerido por `jsdom`, usado en los tests)
- [pnpm](https://pnpm.io)

## Empezar

```bash
pnpm install
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                  | Descripción                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm dev`              | Levanta el servidor de desarrollo                                                           |
| `pnpm build`            | Build de producción                                                                         |
| `pnpm start`            | Sirve el build de producción                                                                |
| `pnpm lint`             | Corre ESLint                                                                                |
| `pnpm format`           | Formatea el proyecto con Prettier                                                           |
| `pnpm format:check`     | Verifica el formateo sin escribir cambios                                                   |
| `pnpm test`             | Corre los tests unitarios/integración (Vitest)                                              |
| `pnpm test:watch`       | Corre Vitest en modo watch                                                                  |
| `pnpm test:e2e`         | Corre los tests e2e con Playwright (requiere `pnpm exec playwright install` la primera vez) |
| `pnpm changeset`        | Registra un changeset (qué cambió y de qué tipo: major/minor/patch)                         |
| `pnpm version-packages` | Aplica los changesets pendientes: sube la versión y actualiza `CHANGELOG.md`                |

## Estructura de carpetas

```
src/
  app/  # rutas de Next.js (App Router)
e2e/    # tests e2e de Playwright
```

El template no impone una organización para código compartido (componentes,
hooks, utilidades, tipos) — armá esas carpetas dentro de `src/` con el criterio
que prefieras a medida que el proyecto lo pida. Los tests unitarios/integración
se co-locan junto al archivo que prueban (`Component.tsx` + `Component.test.tsx`).

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá los valores necesarios.

## Commits

Los mensajes de commit siguen [Conventional Commits](https://www.conventionalcommits.org)
(`feat: ...`, `fix: ...`, `chore: ...`, etc.) y se validan automáticamente con
commitlint en el hook `commit-msg`. El hook `pre-commit` corre lint-staged
(ESLint + Prettier sobre los archivos en stage).

## Versionado y changelog

Este proyecto usa [Changesets](https://github.com/changesets/changesets):

1. Al hacer un cambio que amerite versión nueva, corré `pnpm changeset` y elegí
   el tipo de bump (`major`/`minor`/`patch`) y una descripción breve. Esto crea
   un archivo en `.changeset/` que se commitea junto con el cambio.
2. Cuando quieras liberar una versión, corré `pnpm version-packages`. Esto
   consume los changesets pendientes, sube la versión en `package.json` y
   genera/actualiza `CHANGELOG.md`.

Este template es privado (no se publica a npm), así que no hay un paso de
`publish` — el flujo solo se usa para llevar registro de versión y changelog.

## Actualización de dependencias

[Dependabot](https://docs.github.com/code-security/dependabot) está configurado
en `.github/dependabot.yml` y revisa dependencias de npm y GitHub Actions
semanalmente, agrupando actualizaciones `minor`/`patch` en un solo PR y dejando
las `major` (breaking) separadas para revisión manual. No requiere instalación
adicional: se activa solo al subir el repo a GitHub.
