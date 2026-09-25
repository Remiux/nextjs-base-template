---
'nextjs-base-template': minor
---

Make the template cheaper to adopt and to run:

- Add `pnpm init:project`, which turns a fresh copy into a project: renames it, resets the version, drops the template's changelog, pending changesets and (by default) Changesets with the release workflow, sets the license (`UNLICENSED` by default, or MIT), updates the site name and README, then removes itself.
- Run CI as a single job on the `.nvmrc` Node version that builds once for the e2e tests, and cache `.next/cache` and the Playwright browsers.
- Add Knip to CI to catch unused files, exports and dependencies.
- Check every page for WCAG 2.2 AA violations with axe, in both locales and color schemes.
- Replace the create-next-app favicon with a neutral SVG icon and generate a localized Open Graph image.
- Add `src/env.server.ts` for server-only variables, guarded by `server-only`.
- Trim the VS Code recommendations to project tooling and drop the cSpell config.
