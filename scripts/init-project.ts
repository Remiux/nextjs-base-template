import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

export type License = 'unlicensed' | 'mit';

export interface Change {
  action: 'updated' | 'removed';
  path: string;
}

export interface InitOptions {
  /** npm package name, e.g. `acme-site`. */
  name: string;
  /** Human-readable site name used in metadata, e.g. `Acme`. */
  title: string;
  license: License;
  /** Keep Changesets and the release workflow instead of removing them. */
  keepChangesets: boolean;
}

const PACKAGE_NAME = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

export function isValidPackageName(name: string): boolean {
  return name.length <= 214 && PACKAGE_NAME.test(name);
}

/** `@scope/acme-web_site` -> `Acme Web Site`. */
export function toTitle(name: string): string {
  return name
    .replace(/^@[^/]+\//, '')
    .split(/[-_.]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Removes every `<!-- block:start -->...<!-- block:end -->` section from a Markdown file. */
function removeMarkdownBlock(markdown: string, block: string): string {
  return markdown.replace(
    new RegExp(`<!-- ${block}:start -->[\\s\\S]*?<!-- ${block}:end -->\\n*`, 'g'),
    '',
  );
}

function removeMarkdownMarkers(markdown: string, block: string): string {
  return markdown.replace(new RegExp(`<!-- ${block}:(start|end) -->\\n*`, 'g'), '');
}

/**
 * Turns a fresh copy of the template into a project: renames it, resets the template's version
 * history and license, and drops the template-only pieces (including this script).
 * Returns every file it updated or removed.
 */
export function initProject(root: string, options: InitOptions): Change[] {
  const { name, title, license, keepChangesets } = options;
  const changes: Change[] = [];
  const at = (relativePath: string) => join(root, relativePath);
  const read = (relativePath: string) => readFileSync(at(relativePath), 'utf-8');
  const write = (relativePath: string, content: string) => {
    writeFileSync(at(relativePath), content);
    changes.push({ action: 'updated', path: relativePath });
  };
  const remove = (relativePath: string) => {
    if (!existsSync(at(relativePath))) return;
    rmSync(at(relativePath), { recursive: true, force: true });
    changes.push({ action: 'removed', path: relativePath });
  };

  // package.json: new identity, fresh version and license, template-only scripts out.
  const pkg = JSON.parse(read('package.json')) as Record<string, unknown> & {
    scripts: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  delete pkg.scripts['init:project'];
  if (!keepChangesets) {
    delete pkg.scripts.changeset;
    delete pkg.scripts['version-packages'];
    delete pkg.devDependencies['@changesets/cli'];
  }
  const identity = {
    name,
    version: '0.0.0',
    license: license === 'mit' ? 'MIT' : 'UNLICENSED',
  };
  // Assigning `identity` first fixes the key order (name, version, license at the top);
  // assigning it last makes its values win over the template's.
  const packageJson = Object.assign({ ...identity }, pkg, identity);
  write('package.json', `${JSON.stringify(packageJson, null, 2)}\n`);

  // The template's own release history does not belong to the new project.
  remove('CHANGELOG.md');
  if (keepChangesets) {
    for (const file of readdirSync(at('.changeset'))) {
      if (file.endsWith('.md') && file !== 'README.md') remove(`.changeset/${file}`);
    }
  } else {
    remove('.changeset');
    remove('.github/workflows/release.yml');
  }

  if (license === 'unlicensed') remove('LICENSE');

  const escapedTitle = title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  write(
    'src/config/site.ts',
    read('src/config/site.ts').replace(/name: '(?:[^'\\]|\\.)*'/, `name: '${escapedTitle}'`),
  );

  let readme = read('README.md').replace(/^# .*$/m, `# ${title}`);
  readme = removeMarkdownBlock(readme, 'template-only');
  readme = keepChangesets
    ? removeMarkdownMarkers(readme, 'changesets')
    : removeMarkdownBlock(readme, 'changesets');
  write('README.md', readme.replace(/\n{3,}/g, '\n\n'));

  // Finally, remove this script and its Knip entry.
  const knip = JSON.parse(read('knip.json')) as { entry?: string[] };
  knip.entry = knip.entry?.filter((pattern) => !pattern.startsWith('scripts/'));
  write('knip.json', `${JSON.stringify(knip, null, 2)}\n`);
  remove('scripts/init-project.ts');
  remove('scripts/init-project.test.ts');
  if (existsSync(at('scripts')) && readdirSync(at('scripts')).length === 0) remove('scripts');

  return changes;
}

async function main() {
  const { values } = parseArgs({
    options: {
      name: { type: 'string' },
      title: { type: 'string' },
      license: { type: 'string' },
      'keep-changesets': { type: 'boolean', default: false },
      'skip-install': { type: 'boolean', default: false },
      yes: { type: 'boolean', short: 'y', default: false },
    },
  });
  const root = process.cwd();

  if (!values.yes && !process.stdin.isTTY) {
    throw new Error('Run this in a terminal to answer the prompts, or pass --yes to use defaults.');
  }

  const prompt = values.yes
    ? undefined
    : createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (question: string, fallback: string) =>
    prompt ? (await prompt.question(`${question} (${fallback}): `)).trim() || fallback : fallback;

  let changes: Change[] = [];
  try {
    const folderName = basename(root)
      .toLowerCase()
      .replace(/[^a-z0-9-._~]+/g, '-');
    const name = values.name ?? (await ask('Package name', folderName));
    if (!isValidPackageName(name)) throw new Error(`"${name}" is not a valid npm package name.`);

    const title = values.title ?? (await ask('Site name', toTitle(name)));
    const license = (values.license ?? (await ask('License: unlicensed or mit', 'unlicensed')))
      .trim()
      .toLowerCase();
    if (license !== 'unlicensed' && license !== 'mit') {
      throw new Error(`Unknown license "${license}": use "unlicensed" or "mit".`);
    }
    const keepChangesets = values['keep-changesets'];

    if (prompt) {
      const summary = `${name} ("${title}", ${license}, ${keepChangesets ? 'keeping' : 'removing'} Changesets)`;
      if (!/^y(es)?$/i.test(await ask(`Initialize ${summary}? y/n`, 'n'))) {
        console.log('Aborted, nothing changed.');
        return;
      }
    }

    changes = initProject(root, { name, title, license, keepChangesets });
    for (const { action, path } of changes) console.log(`✔ ${action} ${path}`);
  } finally {
    prompt?.close();
  }

  if (changes.length === 0) return;

  // JSON.stringify and the Markdown edits do not match Prettier's output exactly.
  const updated = changes.filter(({ action }) => action === 'updated').map(({ path }) => path);
  spawnSync('pnpm', ['exec', 'prettier', '--write', '--log-level=warn', ...updated], {
    stdio: 'inherit',
    shell: true,
  });

  if (!values['skip-install']) {
    // Refreshes the lockfile after removing dependencies.
    spawnSync('pnpm', ['install'], { stdio: 'inherit', shell: true });
  }

  console.log(
    '\nNext: review the copy in i18n-builder/messages/, fill in .env.local and commit the result.',
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(`✘ ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
