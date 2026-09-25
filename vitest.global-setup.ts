import { join } from 'node:path';

import { buildMessages } from './i18n-builder/build';

// Tests render with the compiled `messages/<locale>.json`, which is git-ignored.
export default function setup() {
  buildMessages({
    sourceDir: join(import.meta.dirname, 'i18n-builder', 'messages'),
    outputDir: join(import.meta.dirname, 'messages'),
  });
}
