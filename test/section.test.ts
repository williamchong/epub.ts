import { describe, it } from "vitest";

// TODO: These tests require a local HTTP server to serve fixture files.
// Original tests used Karma's built-in static server at localhost:9876.
// Need to either: mock fetch/XHR, or start a local server in beforeAll.

describe.todo("section", () => {
	it.todo("finds a single result in a section");
	it.todo("finds multiple results in a section");
	it.todo("finds result that spanning multiple document nodes, tag at ending");
	it.todo("finds result that spanning multiple document nodes, tag at middle");
});
