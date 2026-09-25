import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Locale-aware wrappers around Next.js' navigation APIs. Use these instead of `next/link` and
 * `next/navigation` so links and redirects keep the current locale.
 * @public — the full set is part of the template's API, even the helpers it does not use itself.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
