---
'nextjs-base-template': patch
---

Fix CI: run `next typegen` before `tsc --noEmit` so Next.js 16's route-typed props (e.g. `LayoutProps`) resolve on a clean checkout, instead of only after a full `next build`.
