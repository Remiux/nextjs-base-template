# nextjs-base-template

## 0.1.3

### Patch Changes

- 6d90563: Fix CI: bump the Node.js version used to run `pnpm test` from 20 to 24. `jsdom@30` requires Node `^22.22.2 || ^24.15.0 || >=26.0.0` and threw `webidl.util.markAsUncloneable is not a function` on Node 20. Also declare `engines.node` in `package.json` and document the requirement in the README so this doesn't resurface locally.

## 0.1.2

### Patch Changes

- 17103a4: Fix CI: run `next typegen` before `tsc --noEmit` so Next.js 16's route-typed props (e.g. `LayoutProps`) resolve on a clean checkout, instead of only after a full `next build`.

## 0.1.1

### Patch Changes

- Add GitHub Actions CI workflow (format check, lint, typecheck, test, build) that runs on pushes and pull requests to `main`.
