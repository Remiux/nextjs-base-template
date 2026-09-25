---
'nextjs-base-template': minor
---

Harden the template's tooling and replace the create-next-app boilerplate:

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
