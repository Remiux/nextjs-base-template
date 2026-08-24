---
'nextjs-base-template': patch
---

Fix CI: bump the Node.js version used to run `pnpm test` from 20 to 24. `jsdom@30` requires Node `^22.22.2 || ^24.15.0 || >=26.0.0` and threw `webidl.util.markAsUncloneable is not a function` on Node 20. Also declare `engines.node` in `package.json` and document the requirement in the README so this doesn't resurface locally.
