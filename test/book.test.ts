import { describe, it, expect, beforeAll } from "vitest";
import Book from "../src/book";
import { getFixtureUrl } from "./helpers";

describe("Book", () => {
	describe("Unarchived", () => {
		var book = new Book(getFixtureUrl("/alice/OPS/package.opf"));

		it("should open a epub", async () => {
			await book.opened;
			expect(book.isOpen).toBe(true);
			expect(book.url.toString()).toBe(getFixtureUrl("/alice/OPS/package.opf"));
		});

		it("should have a local coverUrl", async () => {
			expect(await book.coverUrl()).toBe(getFixtureUrl("/alice/OPS/images/cover_th.jpg"));
		});
	});

	describe("Archived epub", () => {
		var book = new Book(getFixtureUrl("/alice.epub"));

		it("should open a archived epub", async () => {
			await book.opened;
			expect(book.isOpen).toBe(true);
			expect(book.archive).toBeTruthy();
		});

		it("should have a blob coverUrl", async () => {
			let coverUrl = await book.coverUrl();
			expect(coverUrl).toMatch(/^blob:/);
		});
	});

	describe("Archived epub in array buffer", () => {
		let book: Book;

		beforeAll(async () => {
			const response = await fetch(getFixtureUrl("/alice.epub"));
			const buffer = await response.arrayBuffer();
			book = new Book(buffer);
		});

		it("should open a archived epub", async () => {
			await book.opened;
			expect(book.isOpen).toBe(true);
			expect(book.archive).toBeTruthy();
		});

		it("should have a blob coverUrl", async () => {
			let coverUrl = await book.coverUrl();
			expect(coverUrl).toMatch(/^blob:/);
		});
	});

	describe("Archived epub without cover", () => {
		var book = new Book(getFixtureUrl("/alice_without_cover.epub"));

		it("should open a archived epub", async () => {
			await book.opened;
			expect(book.isOpen).toBe(true);
			expect(book.archive).toBeTruthy();
		});

		it("should have a empty coverUrl", async () => {
			let coverUrl = await book.coverUrl();
			expect(coverUrl).toBeNull();
		});
	});
});
