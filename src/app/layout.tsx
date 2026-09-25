import type { ReactNode } from 'react';

// `app/[locale]/layout.tsx` renders the document. This root layout only exists because
// `app/not-found.tsx` needs one; it passes children through untouched.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
