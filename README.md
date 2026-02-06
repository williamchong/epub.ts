# epub.ts (`@likecoin/epub-ts`)

A TypeScript fork of [epubjs](https://github.com/futurepress/epub.js) v0.3.93 — parse and render EPUB documents in the browser.

## Why fork?

epub.js is a mature, widely-used library but development has stalled. This fork modernizes the tooling and converts the source to TypeScript while maintaining API compatibility as a drop-in replacement.

## Install

```bash
npm install @likecoin/epub-ts
```

## Quick Start

```js
import ePub from "@likecoin/epub-ts";

// Same API as epubjs
const book = ePub("/path/to/book.epub");
const rendition = book.renderTo("viewer", { width: 600, height: 400 });
rendition.display();
```

## Migration from epubjs

This is a drop-in replacement. Change your import:

```diff
- import ePub from "epubjs";
+ import ePub from "@likecoin/epub-ts";
```

All APIs remain the same.

## Named Exports

```js
import { Book, EpubCFI, Rendition, Contents, Layout } from "@likecoin/epub-ts";
```

## Development

```bash
npm install
npm run build     # Vite library build → dist/
npm test          # Vitest
npm run typecheck # tsc --noEmit
```

## What's Changed

- Build: webpack + Babel → Vite
- Tests: Karma + Mocha → Vitest
- Source: JavaScript → TypeScript (incremental conversion)
- Removed dependencies: `core-js`, `lodash`, `path-webpack`
- Replaced `event-emitter` with `mitt` (typed, 200 bytes)

## Contributing

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for current conversion progress and what to work on.

## License

BSD-2-Clause (same as epubjs)
