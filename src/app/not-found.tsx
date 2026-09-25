import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        The page you are looking for does not exist.
      </p>
      <Link className="w-fit font-medium underline underline-offset-4" href="/">
        Go back home
      </Link>
    </main>
  );
}
