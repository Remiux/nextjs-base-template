// Next.js resolves `import 'server-only'` to an empty module in server code; Vitest does not,
// so tests alias it to this empty shim.
export {};
