import { describe, it } from "vitest";

// TODO: These tests require a local HTTP server to serve fixture files.
// Original tests used Karma's built-in static server at localhost:9876.
// Need to either: mock fetch/XHR, or start a local server in beforeAll.

describe.todo("Book", () => {
	describe.todo("Unarchived");
	describe.todo("Archived epub");
	describe.todo("Archived epub in array buffer without options");
	describe.todo("Archived epub without cover");
});
