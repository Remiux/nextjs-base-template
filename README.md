# nextjs-base-template

Template base para arrancar proyectos con Next.js (App Router) con la configuración
y herramientas más usadas ya listas.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript estricto, `typedRoutes`)
- [next-intl](https://next-intl.dev) para internacionalización (inglés y español), con un builder que compila las traducciones por ruta
- [Tailwind CSS](https://tailwindcss.com) v4
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io) (con `prettier-plugin-tailwindcss`), orden de imports y reglas para tests (Vitest, Testing Library, jest-dom, Playwright)
- [Zod](https://zod.dev) para validar variables de entorno
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) para tests unitarios/integración, con coverage (v8)
- [Playwright](https://playwright.dev) para tests e2e
- [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) + [commitlint](https://commitlint.js.org) (Conventional Commits)
- [Changesets](https://github.com/changesets/changesets) para versionado semántico y `CHANGELOG.md`
- [Dependabot](https://docs.github.com/code-security/dependabot) para actualizar dependencias automáticamente
- GitHub Actions para CI y para el PR de release

## Requisitos

- Node.js 22.22.2+, 24.15.0+ o 26+ (requerido por `jsdom`, usado en los tests). `.nvmrc` fija la versión recomendada.
- [pnpm](https://pnpm.io)

## Empezar

```bash
pnpm install
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000): te redirige a `/en` o `/es`
según el idioma del navegador.

Para adaptar el template a tu proyecto, cambiá el nombre en `src/config/site.ts`
(de ahí leen la metadata, `robots.txt` y el sitemap) y los textos en
`i18n-builder/messages/`.

## Scripts

| Script                  | Descripción                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm dev`              | Levanta el servidor de desarrollo y recompila las traducciones al guardar                   |
| `pnpm build`            | Compila las traducciones y hace el build de producción                                      |
| `pnpm start`            | Sirve el build de producción                                                                |
| `pnpm lint`             | Corre ESLint (falla también con warnings)                                                   |
| `pnpm typecheck`        | Compila las traducciones, genera los tipos de rutas de Next.js y corre `tsc --noEmit`       |
| `pnpm i18n:build`       | Compila `i18n-builder/messages/` en `messages/<locale>.json`                                |
| `pnpm i18n:check`       | Verifica que todos los idiomas tengan las mismas claves y que `src/` no use claves de más   |
| `pnpm format`           | Formatea el proyecto con Prettier                                                           |
| `pnpm format:check`     | Verifica el formateo sin escribir cambios                                                   |
| `pnpm test`             | Corre los tests unitarios/integración (Vitest)                                              |
| `pnpm test:watch`       | Corre Vitest en modo watch                                                                  |
| `pnpm test:ui`          | Abre la UI de Vitest en el navegador                                                        |
| `pnpm test:coverage`    | Corre los tests con reporte de coverage (`coverage/index.html`)                             |
| `pnpm test:e2e`         | Corre los tests e2e con Playwright (requiere `pnpm exec playwright install` la primera vez) |
| `pnpm changeset`        | Registra un changeset (qué cambió y de qué tipo: major/minor/patch)                         |
| `pnpm version-packages` | Aplica los changesets pendientes: sube la versión y actualiza `CHANGELOG.md`                |

`pnpm test:e2e` usa `pnpm dev` en local; en CI (`CI=1`) prueba el build de producción
con `pnpm build && pnpm start`.

## Estructura de carpetas

```
src/
  app/
    [locale]/     # páginas localizadas (layout, page, not-found, error)
    robots.ts, sitemap.ts, global-error.tsx
  components/     # componentes compartidos (p. ej. el selector de idioma)
  config/         # configuración del sitio (nombre, URL)
  i18n/           # configuración de next-intl (idiomas, routing, navegación, SEO)
  test-utils/     # helpers de tests (p. ej. `renderWithIntl`)
  env.ts          # variables de entorno validadas con Zod
  proxy.ts        # negociación de idioma y redirects
i18n-builder/     # traducciones fuente y el builder que las compila
e2e/              # tests e2e de Playwright
```

El template no impone una organización para código compartido (componentes,
hooks, utilidades, tipos) — armá esas carpetas dentro de `src/` con el criterio
que prefieras a medida que el proyecto lo pida. Los tests unitarios/integración
se co-locan junto al archivo que prueban (`Component.tsx` + `Component.test.tsx`)
e importan `describe`/`it`/`expect` desde `vitest` (no hay globals).

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá los valores necesarios.

Las variables se validan en `src/env.ts`: si falta una obligatoria o tiene un
formato inválido, el build falla con un mensaje claro. Al agregar una variable
nueva, sumala al schema de `src/env.ts` y a `.env.example`. Importá siempre
`env` desde `@/env` en lugar de leer `process.env` directamente.

## Internacionalización

Usa [next-intl](https://next-intl.dev) con el idioma como prefijo de la URL
(`/en/...`, `/es/...`) y un builder propio que compila traducciones organizadas
por ruta.

- Las traducciones se editan en `i18n-builder/messages/<ruta>/<idioma>.json`. El
  builder las junta en `messages/<idioma>.json`, que se genera y no se commitea.
  Detalle completo en [`i18n-builder/README.md`](i18n-builder/README.md).
- `src/proxy.ts` elige el idioma (cookie primero, después el header
  `Accept-Language`, y si no, `en`) y redirige a la URL con prefijo.
- Las claves están tipadas: `t('clave-inexistente')` falla en `pnpm typecheck`, y
  `pnpm i18n:check` (también en CI) detecta claves faltantes entre idiomas.
- Cada página bajo `app/[locale]` llama a `resolveRouteLocale` y, si tiene metadata,
  usa `getAlternates` para el canonical y los links `hreflang`.
- Para navegar, importá `Link`, `redirect`, `useRouter` y `usePathname` desde
  `@/i18n/navigation` (no desde `next/link` ni `next/navigation`), así conservan el idioma.
- En tests, renderizá con `renderWithIntl` de `@/test-utils/render-with-intl`.

## Next.js

`next.config.ts` activa `typedRoutes` (los `href` de `<Link>` se validan en
tiempo de compilación), quita el header `X-Powered-By` y agrega headers de
seguridad básicos a todas las respuestas. Para una Content-Security-Policy,
seguí la guía en `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.

## Editor

`.vscode/` recomienda las extensiones del proyecto y activa format on save con
Prettier y los fixes de ESLint al guardar. `.editorconfig` y `.gitattributes`
fuerzan finales de línea LF en todos los sistemas operativos.

## Commits

Los mensajes de commit siguen [Conventional Commits](https://www.conventionalcommits.org)
(`feat: ...`, `fix: ...`, `chore: ...`, etc.) y se validan automáticamente con
commitlint en el hook `commit-msg`. El hook `pre-commit` corre lint-staged
(ESLint + Prettier sobre los archivos en stage).

## CI

`.github/workflows/ci.yml` corre en cada push y PR a `main`:

- **verify** (Node 22 y 24): `format:check`, `lint`, `typecheck`, `test:coverage` y `build`.
- **e2e**: tests de Playwright contra el build de producción. El reporte HTML
  queda como artifact del run.

## Versionado y changelog

Este proyecto usa [Changesets](https://github.com/changesets/changesets):

1. Al hacer un cambio que amerite versión nueva, corré `pnpm changeset` y elegí
   el tipo de bump (`major`/`minor`/`patch`) y una descripción breve. Esto crea
   un archivo en `.changeset/` que se commitea junto con el cambio.
2. Al mergear a `main`, `.github/workflows/release.yml` abre (o actualiza) un PR
   "chore(release): version packages" que consume los changesets pendientes,
   sube la versión en `package.json` y actualiza `CHANGELOG.md`. Mergear ese PR
   libera la versión. También podés hacerlo a mano con `pnpm version-packages`.

Para que el workflow pueda abrir el PR, activá **Allow GitHub Actions to create
and approve pull requests** en _Settings → Actions → General_ del repo.

Este template es privado (no se publica a npm), así que no hay un paso de
`publish` — el flujo solo se usa para llevar registro de versión y changelog.

## Actualización de dependencias

[Dependabot](https://docs.github.com/code-security/dependabot) está configurado
en `.github/dependabot.yml` y revisa dependencias de npm y GitHub Actions
semanalmente. Agrupa en un solo PR los paquetes que tienen que moverse juntos
(`next` + `eslint-config-next`, `react` + `react-dom` + sus tipos, `vitest` +
`@vitest/*`) y el resto de las actualizaciones `minor`/`patch`; las `major`
(breaking) de otros paquetes quedan separadas para revisión manual. `@types/node`
no recibe bumps `major` porque sigue la versión mínima de `engines.node`. No
requiere instalación adicional: se activa solo al subir el repo a GitHub.
