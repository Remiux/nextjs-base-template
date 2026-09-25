import { z } from 'zod';

/** Validates `values` against `schema`, throwing a readable error that lists every invalid variable. */
export function parseEnv<Schema extends z.ZodType>(
  schema: Schema,
  values: z.input<Schema>,
): z.output<Schema> {
  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
  }

  return parsed.data;
}

// Public variables, safe to import anywhere. Server-only secrets go in `src/env.server.ts`.
// NEXT_PUBLIC_* values are inlined at build time only when referenced literally,
// so list each variable by name instead of passing `process.env` as a whole.
export const env = parseEnv(
  z.object({
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
  }),
  {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
);
