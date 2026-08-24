# nextjs-base-template

## 0.1.2

### Patch Changes

- 17103a4: Fix CI: run `next typegen` before `tsc --noEmit` so Next.js 16's route-typed props (e.g. `LayoutProps`) resolve on a clean checkout, instead of only after a full `next build`.

## 0.1.1

### Patch Changes

- Add GitHub Actions CI workflow (format check, lint, typecheck, test, build) that runs on pushes and pull requests to `main`.
