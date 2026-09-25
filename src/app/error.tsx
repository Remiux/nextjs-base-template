'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // Replace with your error reporting service.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <button
        type="button"
        className="w-fit font-medium underline underline-offset-4"
        onClick={() => retry()}
      >
        Try again
      </button>
    </main>
  );
}
