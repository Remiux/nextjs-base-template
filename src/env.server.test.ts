import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadServerEnv() {
  vi.resetModules();
  return (await import('./env.server')).serverEnv;
}

describe('serverEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('exposes valid server variables', async () => {
    vi.stubEnv('EXAMPLE_API_KEY', 'secret');

    await expect(loadServerEnv()).resolves.toMatchObject({ EXAMPLE_API_KEY: 'secret' });
  });

  it('throws when a server variable is invalid', async () => {
    vi.stubEnv('EXAMPLE_API_KEY', '');

    await expect(loadServerEnv()).rejects.toThrow(/EXAMPLE_API_KEY/);
  });
});
