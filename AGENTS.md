# AGENTS.md

## Commands
- `npm run build` — Vite library build
- `npm test` — Vitest
- `npm run typecheck` — tsc --noEmit
- `npm run lint` — ESLint

## Codebase
- `src/` — Library source (TypeScript)
- `test/` — Vitest tests
- `dist/` — Build output (gitignored)
- `types/` — Legacy TS declarations (will be removed after full TS conversion)

## Conventions
- ES6 classes with inline typed emitter
- Strict TS (noImplicitAny, strictNullChecks)
- API-compatible with epubjs v0.3.93
- Tabs for indentation, double quotes for strings
- BSD-2-Clause license

## Status
See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for conversion progress.
