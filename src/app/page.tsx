import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">{siteConfig.name}</h1>
      <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        To get started, edit{' '}
        <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
          src/app/page.tsx
        </code>
        . Rename the project in{' '}
        <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
          src/config/site.ts
        </code>
        .
      </p>
      <a
        className="w-fit font-medium underline underline-offset-4"
        href="https://nextjs.org/docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Documentation
      </a>
    </main>
  );
}
