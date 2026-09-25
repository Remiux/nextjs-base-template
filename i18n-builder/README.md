# i18n builder

Compiles per-route translation files into the one-file-per-locale catalogues that
[`next-intl`](https://next-intl.dev) loads.

## How it works

`build.ts`:

1. Collects every `.json` file under `i18n-builder/messages/`.
2. Takes the locale from the filename (`en.json`, `es.json`).
3. Nests the file's content under its folder path. Route groups in parentheses, such as
   `(base)`, are stripped, so their keys land at the top level.
4. Deep-merges all files of the same locale and writes `messages/<locale>.json`.
5. Deletes compiled catalogues of locales that no longer have sources.

If any source file is invalid JSON, or its root is not an object, nothing is written and the
command exits with code 1, so `build`, `typecheck` and CI fail instead of shipping stale messages.

### Example

```
i18n-builder/messages/
├── (base)/
│   ├── en.json   { "metadata": { "description": "..." } }
│   └── es.json
└── home/
    ├── en.json   { "docs": "Documentation" }
    └── es.json   { "docs": "Documentación" }
```

compiles to:

```jsonc
// messages/en.json
{
  "metadata": { "description": "..." },
  "home": { "docs": "Documentation" },
}
```

and is used as:

```tsx
const t = useTranslations('home');
t('docs'); // "Documentation"
```

`messages/*.json` and the `messages/en.d.json.ts` declaration that `next-intl` generates from it
are build output and git-ignored. Edit the files under `i18n-builder/messages/` only.

## Scripts

| Command           | What it does                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`        | Builds once, then runs the builder in watch mode next to `next dev` (300 ms debounce).                                  |
| `pnpm build`      | Builds the messages, then runs `next build`.                                                                            |
| `pnpm typecheck`  | Builds the messages, so message keys are type-checked against the English catalogue.                                    |
| `pnpm i18n:build` | Builds the messages once.                                                                                               |
| `pnpm i18n:check` | Builds, then fails if a locale misses or adds keys versus `en`, or if `src/` uses undefined keys or leaves keys unused. |

`pnpm test` builds the messages too, through `vitest.global-setup.ts`.

## How it fits together

```
i18n-builder/messages/**/<locale>.json   <-- source translations (edit these)
        │
        ▼  pnpm i18n:build
messages/<locale>.json                   <-- compiled catalogues (git-ignored)
        │
        ▼
src/i18n/request.ts                      <-- resolves the request locale and loads its catalogue
src/i18n/routing.ts                      <-- locales, default locale, locale detection
   ├── src/proxy.ts                      <-- locale negotiation, redirects, locale cookie
   └── src/i18n/navigation.ts            <-- locale-aware Link, redirect, useRouter, usePathname
global.ts                                <-- types `Locale` and `Messages` for next-intl
```

## Adding a locale

1. Add its code to `locales` in `src/i18n/locales.ts`.
2. Add a `<locale>.json` next to every existing `en.json` under `i18n-builder/messages/`.
3. Add the language name to `locale-switcher.locale` in `(base)/<locale>.json` of every locale.
4. Run `pnpm i18n:check`.

## Localized pathnames

All locales share the same pathnames (`/en/about`, `/es/about`). To translate them
(`/es/acerca`), add `pathnames` to `src/i18n/routing.ts`; see
https://next-intl.dev/docs/routing/configuration#pathnames.
