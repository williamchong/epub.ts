# epub.ts (`@likecoin/epub-ts`)

A TypeScript fork of [epubjs](https://github.com/futurepress/epub.js) v0.3.93 by [Fred Chasen](https://github.com/fchasen) / [FuturePress](https://github.com/futurepress) — parse and render EPUB documents in the browser.

This library is primarily developed for internal use at [3ook.com](https://3ook.com) and is provided as-is. It was mainly built with AI-assisted development.

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

## What's Changed

- Build: webpack + Babel → Vite
- Tests: Karma + Mocha → Vitest
- Source: JavaScript → TypeScript (incremental conversion)
- Removed dependencies: `core-js`, `lodash`, `path-webpack`
- Replaced `event-emitter` with inline typed emitter

## Development

```bash
npm install
npm run build     # Vite library build → dist/
npm test          # Vitest
npm run typecheck # tsc --noEmit
```

## Contributing

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for current conversion progress and what to work on.

## License

BSD-2-Clause (same as epubjs)
