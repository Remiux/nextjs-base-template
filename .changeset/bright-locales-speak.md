---
'nextjs-base-template': minor
---

Add internationalization with `next-intl`: locale-prefixed routes under `app/[locale]` (English and Spanish, English by default), locale negotiation in `src/proxy.ts`, a locale switcher, localized metadata, not-found and error pages, and `hreflang` alternates in the metadata and sitemap. Translations live per route in `i18n-builder/messages/` and are compiled into `messages/<locale>.json` by `pnpm i18n:build`; `pnpm i18n:check` (also in CI) flags missing or unused keys, and message keys are type-checked.
