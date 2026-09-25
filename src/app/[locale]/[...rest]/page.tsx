import { notFound } from 'next/navigation';

// Unknown paths under a locale (e.g. `/en/missing`) render the localized `[locale]/not-found.tsx`.
export default function CatchAllPage() {
  notFound();
}
