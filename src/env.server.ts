import 'server-only';

import { z } from 'zod';

import { parseEnv } from './env';

// Server-only variables (API keys, database URLs, ...). `server-only` makes the build fail if a
// Client Component imports this file, so these values never reach the browser.
// `EXAMPLE_API_KEY` is a placeholder: replace it with your own variables.
export const serverEnv = parseEnv(
  z.object({
    EXAMPLE_API_KEY: z.string().min(1).optional(),
  }),
  {
    EXAMPLE_API_KEY: process.env.EXAMPLE_API_KEY,
  },
);
