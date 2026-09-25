import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadEnv() {
  vi.resetModules();
  return (await import('./env')).env;
}

describe('env', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('falls back to localhost when NEXT_PUBLIC_APP_URL is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', undefined);

    await expect(loadEnv()).resolves.toMatchObject({
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    });
  });

  it('uses NEXT_PUBLIC_APP_URL when it is a valid URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'https://example.com');

    await expect(loadEnv()).resolves.toMatchObject({
      NEXT_PUBLIC_APP_URL: 'https://example.com',
    });
  });

  it('throws when NEXT_PUBLIC_APP_URL is not a valid URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_URL', 'not-a-url');

    await expect(loadEnv()).rejects.toThrow(/NEXT_PUBLIC_APP_URL/);
  });
});
