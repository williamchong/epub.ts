# Project Status

## Current Stage: B (TypeScript Conversion)

### Stage A: Build + Tests
- [x] A1: Replace webpack+babel+karma with vite+vitest
- [x] A2: Convert tests to Vitest

### Stage B: TypeScript Conversion
- [ ] B0a: Replace event-emitter with mitt
- [ ] B0b: Inline marks-pane
- [ ] B1: Level 0 leaf utilities
- [ ] B2: Level 1 simple dependents
- [ ] B3: Level 2 modules
- [ ] B4: Level 3 modules
- [ ] B5: Level 4-5 managers + rendition
- [ ] B6: Level 6 top-level modules, remove types/

### Stage C: Improvements (not started)
- [ ] Replace `localforage` with lighter IndexedDB wrapper
- [ ] Replace `@xmldom/xmldom` with browser-native DOMParser
- [ ] Enable `strictNullChecks`
- [ ] Enable `noImplicitAny`
- [ ] Full `strict: true`
- [ ] Node.js support (parsing-only entry point)
- [ ] Improve test coverage
- [ ] ESLint + TS plugin
- [ ] GitHub Actions CI

### Dependency Status
| Dep | Status | Notes |
|---|---|---|
| `core-js` | ✅ Removed (A1) | Babel polyfills, not needed with Vite |
| `lodash` | ✅ Removed (A1) | throttle/debounce replaced with native |
| `path-webpack` | ✅ Removed (A1) | Replaced with inline path utils |
| `event-emitter` | ⏳ Pending B0a | Replace with mitt |
| `marks-pane` | ⏳ Pending B0b | Inline typed code |
| `jszip` | ✅ Keep | Core dependency |
| `localforage` | ✅ Keep | Storage (replace in Stage C) |
| `@xmldom/xmldom` | ✅ Keep | XML parsing (replace in Stage C) |

### Test Status
| Test | Status | Notes |
|---|---|---|
| core.test.ts | ✅ Passing | 2 skipped: file: URL opaque origin (spec behavior, Chrome differs) |
| epubcfi.test.ts | ✅ Passing | |
| locations.test.ts | ✅ Passing | |
| epub.test.ts | ⏳ TODO | Needs local HTTP server for fixtures |
| book.test.ts | ⏳ TODO | Needs local HTTP server for fixtures |
| section.test.ts | ⏳ TODO | Needs local HTTP server for fixtures |
