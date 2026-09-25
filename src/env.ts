import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
});

// NEXT_PUBLIC_* values are inlined at build time only when referenced literally,
// so list each variable by name instead of passing `process.env` as a whole.
// Server-only secrets belong in a separate schema that Client Components never import.
const parsed = schema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
