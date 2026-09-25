import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';

type JsonObject = Record<string, unknown>;

export interface BuildOptions {
  /** Folder with the per-route source files: `<route>/<locale>.json`. */
  sourceDir: string;
  /** Folder that receives one compiled `<locale>.json` per locale. */
  outputDir: string;
}

export interface BuiltLocale {
  locale: string;
  namespaces: number;
}

export class MessagesBuildError extends Error {}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(target: JsonObject, source: JsonObject): JsonObject {
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const current = result[key];
    result[key] = isJsonObject(current) && isJsonObject(value) ? deepMerge(current, value) : value;
  }
  return result;
}

function collectJsonFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) return collectJsonFiles(fullPath);
    return entry.endsWith('.json') ? [fullPath] : [];
  });
}

// Folder path relative to the source root, minus route groups such as `(marketing)`.
function getNamespaceSegments(sourceDir: string, filePath: string): string[] {
  return relative(sourceDir, dirname(filePath))
    .split(sep)
    .filter((segment) => segment && segment !== '.')
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')));
}

function readSourceFile(sourceDir: string, filePath: string): JsonObject {
  const relativePath = relative(sourceDir, filePath);
  let parsed: unknown;

  try {
    parsed = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch {
    throw new MessagesBuildError(`JSON parse error in ${relativePath}`);
  }

  if (!isJsonObject(parsed)) {
    throw new MessagesBuildError(`JSON root must be an object in ${relativePath}`);
  }

  return parsed;
}

/**
 * Compiles every `<route>/<locale>.json` under `sourceDir` into `outputDir/<locale>.json`,
 * nesting each file's content under its folder path. Nothing is written if any source is invalid.
 */
export function buildMessages({ sourceDir, outputDir }: BuildOptions): BuiltLocale[] {
  const localeMap = new Map<string, JsonObject>();

  for (const filePath of collectJsonFiles(sourceDir)) {
    const locale = basename(filePath, '.json');
    const nested = getNamespaceSegments(sourceDir, filePath).reduceRight<JsonObject>(
      (content, segment) => ({ [segment]: content }),
      readSourceFile(sourceDir, filePath),
    );
    localeMap.set(locale, deepMerge(localeMap.get(locale) ?? {}, nested));
  }

  mkdirSync(outputDir, { recursive: true });

  // Drop compiled catalogues of locales that no longer have sources.
  for (const entry of readdirSync(outputDir)) {
    if (entry.endsWith('.json') && !localeMap.has(basename(entry, '.json'))) {
      rmSync(join(outputDir, entry));
    }
  }

  return [...localeMap].map(([locale, messages]) => {
    writeFileSync(join(outputDir, `${locale}.json`), `${JSON.stringify(messages, null, 2)}\n`);
    return { locale, namespaces: Object.keys(messages).length };
  });
}
