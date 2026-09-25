// @vitest-environment node
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { initProject, isValidPackageName, toTitle } from './init-project';

const repoRoot = join(import.meta.dirname, '..');

// Real template files, so the test breaks if the README markers or the site config drift.
const templateFiles = [
  'package.json',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'knip.json',
  '.changeset',
  '.github/workflows/release.yml',
  'src/config/site.ts',
  'scripts/init-project.ts',
  'scripts/init-project.test.ts',
];

let root: string;

const read = (path: string) => readFileSync(join(root, path), 'utf-8');
interface PackageJson {
  name: string;
  version: string;
  license: string;
  scripts: Record<string, string>;
  devDependencies: Record<string, string>;
}

const readPackageJson = () => JSON.parse(read('package.json')) as PackageJson;
const readKnipEntries = () => (JSON.parse(read('knip.json')) as { entry: string[] }).entry;
const exists = (path: string) => existsSync(join(root, path));

describe('initProject', () => {
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'init-project-'));
    for (const file of templateFiles) {
      cpSync(join(repoRoot, file), join(root, file), { recursive: true });
    }
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  describe('with the defaults (private license, no Changesets)', () => {
    beforeEach(() => {
      initProject(root, {
        name: 'acme-site',
        title: 'Acme',
        license: 'unlicensed',
        keepChangesets: false,
      });
    });

    it('renames the package, resets its version and marks it private', () => {
      const pkg = readPackageJson();

      expect(Object.keys(pkg).slice(0, 3)).toEqual(['name', 'version', 'license']);
      expect(pkg).toMatchObject({ name: 'acme-site', version: '0.0.0', license: 'UNLICENSED' });
      expect(exists('LICENSE')).toBe(false);
    });

    it('removes the template history, Changesets and the release workflow', () => {
      const pkg = readPackageJson();

      expect(exists('CHANGELOG.md')).toBe(false);
      expect(exists('.changeset')).toBe(false);
      expect(exists('.github/workflows/release.yml')).toBe(false);
      expect(pkg.scripts).not.toHaveProperty('changeset');
      expect(pkg.scripts).not.toHaveProperty('version-packages');
      expect(pkg.devDependencies).not.toHaveProperty('@changesets/cli');
    });

    it('sets the site name', () => {
      expect(read('src/config/site.ts')).toContain("name: 'Acme',");
    });

    it('rewrites the README without template-only or Changesets sections', () => {
      const readme = read('README.md');

      expect(readme.startsWith('# Acme\n\n## Stack')).toBe(true);
      expect(readme).not.toContain('init:project');
      expect(readme).not.toContain('## Versionado y changelog');
      expect(readme).not.toContain('<!--');
      expect(readme).not.toMatch(/\n{3,}/);
      expect(readme).toContain('## Empezar');
    });

    it('removes itself and its Knip entry', () => {
      expect(exists('scripts')).toBe(false);
      expect(readPackageJson().scripts).not.toHaveProperty('init:project');
      expect(readKnipEntries()).not.toContain('scripts/*.ts');
    });
  });

  describe('keeping Changesets and the MIT license', () => {
    beforeEach(() => {
      initProject(root, {
        name: 'acme-site',
        title: 'Acme',
        license: 'mit',
        keepChangesets: true,
      });
    });

    it('keeps the Changesets setup but drops the pending template changesets', () => {
      expect(readdirSync(join(root, '.changeset')).sort()).toEqual(['README.md', 'config.json']);
      expect(exists('.github/workflows/release.yml')).toBe(true);
      expect(exists('CHANGELOG.md')).toBe(false);
      expect(readPackageJson().scripts).toHaveProperty('changeset');
    });

    it('keeps the license and the versioning docs without markers', () => {
      const readme = read('README.md');

      expect(exists('LICENSE')).toBe(true);
      expect(readPackageJson().license).toBe('MIT');
      expect(readme).toContain('## Versionado y changelog');
      expect(readme).not.toContain('<!--');
    });
  });

  it('escapes quotes in the site name', () => {
    initProject(root, {
      name: 'acme-site',
      title: "Acme's Shop",
      license: 'unlicensed',
      keepChangesets: false,
    });

    expect(read('src/config/site.ts')).toContain("name: 'Acme\\'s Shop',");
  });
});

describe('isValidPackageName', () => {
  it.each(['acme', 'acme-site', '@acme/site', 'acme.site'])('accepts %s', (name) => {
    expect(isValidPackageName(name)).toBe(true);
  });

  it.each(['Acme', 'acme site', '', '@acme'])('rejects "%s"', (name) => {
    expect(isValidPackageName(name)).toBe(false);
  });
});

describe('toTitle', () => {
  it('turns a package name into a readable site name', () => {
    expect(toTitle('@acme/my-web_site')).toBe('My Web Site');
  });
});
