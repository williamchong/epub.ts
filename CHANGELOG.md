# Changelog

## 0.3.96 (2026-02-07)

### Type safety

- Replace `any` with proper types across all public APIs: `ePub()`, `Book.ready`,
  `Book.loaded`, `Rendition.next/prev`, `Locations.generateFromWords`,
  `Store.getText/getBase64`, `EpubCFI.base/path/parse/fromRange/fromNode`, and more
- Fix `SpineItem.next()/prev()` return type from `SpineItem` to `Section`
  (matches runtime behavior; eliminates all `as unknown as Section` casts)
- Export all public classes (`Spine`, `Locations`, `Navigation`, `PageList`,
  `Resources`, `Packaging`, `Archive`, `Store`, `DisplayOptions`, `Annotations`,
  `Themes`, `Mapping`) from package entry point

### Bug fixes

- Fix `EpubCFI.compare()` null-safety bug: offset comparison now guards against
  null offsets instead of silently returning "equal"
- Fix `Annotations.each()` which used broken `forEach.apply` on a Record
- Fix `Locations.processWords` early return to resolve with `[]` instead of
  `undefined`
- Guard rendition mark-click callback against destroyed view contents

## 0.3.95 (2026-02-07)

### Exports

- Export `Section` class from package entry point
- Re-export all shared types (`NavItem`, `Location`, etc.) from package entry,
  matching the original epubjs public API surface

## 0.3.94 (2026-02-07)

### Bug fixes

- Enable `display: inline-block` on column containers to fix iOS WebKit
  scrollWidth inflation loop that caused infinite width calculation.
  Note: this may cause layout issues with RTL content.

## 0.3.93 (2026-02-07)

Initial release of `@likecoin/epub-ts`, a TypeScript fork of [epubjs](https://github.com/futurepress/epub.js) v0.3.93.

### Build & tooling

- Replaced webpack + Babel + Karma with Vite + Vitest
- Added ESLint with TypeScript plugin (0 errors, 0 warnings)
- Added GitHub Actions CI

### TypeScript conversion

- Converted all source files from JavaScript to TypeScript
- Enabled `noImplicitAny` (270 implicit-any params annotated)
- Replaced ~528 explicit `any` with proper types
- Enabled `strictNullChecks` (476 errors fixed across 30 files)

### Dependencies removed

- `core-js` (Babel polyfills, not needed with Vite)
- `lodash` (throttle/debounce replaced with native)
- `path-webpack` (replaced with inline path utils)
- `event-emitter` (replaced with inline typed emitter)
- `marks-pane` (inlined as src/marks-pane/)

### Bug fixes

- Fixed Path class directory extension parsing
- Fixed Url file:// origin handling
- Fixed all skipped/todo tests with HTTP fixture server
