import { watch } from 'node:fs';
import { join } from 'node:path';

import { buildMessages, MessagesBuildError } from './build';

const sourceDir = join(import.meta.dirname, 'messages');
const outputDir = join(import.meta.dirname, '..', 'messages');
const isWatch = process.argv.includes('--watch');

function run(): boolean {
  try {
    for (const { locale, namespaces } of buildMessages({ sourceDir, outputDir })) {
      console.log(`[i18n-build] ✔ ${locale}.json (${String(namespaces)} namespaces)`);
    }
    return true;
  } catch (error) {
    if (!(error instanceof MessagesBuildError)) throw error;
    console.error(`[i18n-build] ✘ ${error.message} — build skipped`);
    return false;
  }
}

const ok = run();

if (!isWatch) {
  // Fail `build`, `typecheck` and CI instead of continuing with stale messages.
  process.exitCode = ok ? 0 : 1;
} else {
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  console.log('[i18n-build] Watching i18n-builder/messages/ ...');
  watch(sourceDir, { recursive: true }, (_event, filename) => {
    if (!filename?.endsWith('.json')) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`[i18n-build] Change detected: ${filename}`);
      run();
    }, 300);
  });
}
