'use client'; // Error boundaries must be Client Components

import './globals.css';

import { useEffect } from 'react';

// Replaces the root layout when it throws, so it renders its own <html> and <body>
// and cannot export `metadata`.
export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 font-sans">
        <title>Something went wrong</title>
        <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
        <button
          type="button"
          className="font-medium underline underline-offset-4"
          onClick={() => retry()}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
