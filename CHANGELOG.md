# nextjs-base-template

## 0.2.1

### Patch Changes

- fda52e9: Hold the MIT license in the name of Remiux, the template's new owner.

## 0.2.0

### Minor Changes

- e1e4ae0: Add internationalization with `next-intl`: locale-prefixed routes under `app/[locale]` (English and Spanish, English by default), locale negotiation in `src/proxy.ts`, a locale switcher, localized metadata, not-found and error pages, and `hreflang` alternates in the metadata and sitemap. Translations live per route in `i18n-builder/messages/` and are compiled into `messages/<locale>.json` by `pnpm i18n:build`; `pnpm i18n:check` (also in CI) flags missing or unused keys, and message keys are type-checked.
- e9aed64: Harden the template's tooling and replace the create-next-app boilerplate:

  - Normalize line endings to LF (`.gitattributes`, `.editorconfig`) so `pnpm format:check` passes on Windows.
  - Run Playwright e2e in CI against the production build, and verify on Node 22 and 24 with least-privilege permissions, concurrency and timeouts.
  - Add a Changesets release workflow that opens the "Version Packages" PR.
  - Group Dependabot updates for packages that must move together.
  - Add `typecheck`, `test:ui` and `test:coverage` scripts, `.nvmrc`, shared VS Code settings and a cSpell config.
  - Stricter `tsconfig` (`noUncheckedIndexedAccess`, `noImplicitOverride`, ES2022 target).
  - Vitest: explicit imports instead of globals, reuse tsconfig path aliases, v8 coverage.
  - ESLint: import ordering plus Vitest, Testing Library, jest-dom and Playwright rules; warnings fail `pnpm lint`.
  - Validate environment variables with Zod in `src/env.ts`.
  - Neutral home page, site config in `src/config/site.ts`, `not-found`, `error`, `global-error`, `robots.txt` and `sitemap.xml`.
  - Enable `typedRoutes`, drop `X-Powered-By` and send baseline security headers.
  - Fix Geist being overridden by an Arial `font-family` on `body`.

- 40c2679: Make the template cheaper to adopt and to run:

  - Add `pnpm init:project`, which turns a fresh copy into a project: renames it, resets the version, drops the template's changelog, pending changesets and (by default) Changesets with the release workflow, sets the license (`UNLICENSED` by default, or MIT), updates the site name and README, then removes itself.
  - Run CI as a single job on the `.nvmrc` Node version that builds once for the e2e tests, and cache `.next/cache` and the Playwright browsers.
  - Add Knip to CI to catch unused files, exports and dependencies.
  - Check every page for WCAG 2.2 AA violations with axe, in both locales and color schemes.
  - Replace the create-next-app favicon with a neutral SVG icon and generate a localized Open Graph image.
  - Add `src/env.server.ts` for server-only variables, guarded by `server-only`.
  - Trim the VS Code recommendations to project tooling and drop the cSpell config.

### Patch Changes

- e9aed64: Update dependencies: Next.js and `eslint-config-next` 16.3.6, Vitest 5 (with `@vitest/ui` and `@vitest/coverage-v8`), commitlint, Prettier, jsdom and the React and Node type packages.
- 37bcccc: Update minor and patch dependencies: Next.js, React, Playwright, Testing
  Library, Changesets, lint-staged and `@vitejs/plugin-react`.
- 1ab1571: Add an MIT license and a VS Code recommended-extensions list.
- 723cb5c: Align `@types/node` with the lowest Node version `engines.node` supports.

## 0.1.3

### Patch Changes

- 6d90563: Fix CI: bump the Node.js version used to run `pnpm test` from 20 to 24. `jsdom@30` requires Node `^22.22.2 || ^24.15.0 || >=26.0.0` and threw `webidl.util.markAsUncloneable is not a function` on Node 20. Also declare `engines.node` in `package.json` and document the requirement in the README so this doesn't resurface locally.

## 0.1.2

### Patch Changes

- 17103a4: Fix CI: run `next typegen` before `tsc --noEmit` so Next.js 16's route-typed props (e.g. `LayoutProps`) resolve on a clean checkout, instead of only after a full `next build`.

## 0.1.1

### Patch Changes

- Add GitHub Actions CI workflow (format check, lint, typecheck, test, build) that runs on pushes and pull requests to `main`.
