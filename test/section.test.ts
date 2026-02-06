import { describe, it, expect } from "vitest";
import ePub from "../src/epub";
import { getFixtureUrl } from "./helpers";

describe("section", () => {
	it("finds a single result in a section", async () => {
		var book = ePub(getFixtureUrl("/alice/"), { width: 400, height: 400 });

		await book.ready;
		var section = book.section("chapter_001.xhtml");
		await section.load();

		const queryString = "they were filled with cupboards and book-shelves";
		const findResults = section.find(queryString);
		const searchResults = section.search(queryString);

		for (const results of [findResults, searchResults]) {
			expect(results.length).toBe(1);
			expect(results[0].cfi).toBe("epubcfi(/6/8!/4/2/16,/1:275,/1:323)");
			expect(results[0].excerpt).toBe("... see anything; then she looked at the sides of the well and\n\t\tnoticed that they were filled with cupboards and book-shelves; here and there she saw\n\t\t...");
		}
	});

	it("finds multiple results in a section", async () => {
		var book = ePub(getFixtureUrl("/alice/"), { width: 400, height: 400 });

		await book.ready;
		var section = book.section("chapter_001.xhtml");
		await section.load();

		const queryString = "white rabbit";
		const findResults = section.find(queryString);
		const searchResults = section.search(queryString);

		for (const results of [findResults, searchResults]) {
			expect(results.length).toBe(2);
			expect(results[0].cfi).toBe("epubcfi(/6/8!/4/2/8,/1:240,/1:252)");
			expect(results[0].excerpt).toBe("...e worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her....");
			expect(results[1].cfi).toBe("epubcfi(/6/8!/4/2/20,/1:148,/1:160)");
			expect(results[1].excerpt).toBe("...ut it was\n\t\tall dark overhead; before her was another long passage and the White Rabbit was still\n\t\tin sight, hurrying down it. There was not a moment...");
		}
	});

	it("finds result spanning multiple document nodes, tag at ending", async () => {
		var book = ePub(getFixtureUrl("/alice/"), { width: 400, height: 400 });

		await book.ready;
		var section = book.section("chapter_010.xhtml");
		await section.load();

		const queryString = "I beg";
		const findResult = section.find(queryString);
		expect(findResult.length).toBe(0);

		const searchResults = section.search(queryString);
		expect(searchResults.length).toBe(1);
		expect(searchResults[0].cfi).toBe("epubcfi(/6/26!/4/2/6,/1:5,/2/1:3)");
		expect(searchResults[0].excerpt).toBe('"Oh, I beg');
	});

	it("finds result spanning multiple document nodes, tag at middle", async () => {
		var book = ePub(getFixtureUrl("/alice/"), { width: 400, height: 400 });

		await book.ready;
		var section = book.section("chapter_010.xhtml");
		await section.load();

		const queryString = "I beg your pardon";
		const findResult = section.find(queryString);
		expect(findResult.length).toBe(0);

		const searchResults = section.search(queryString);
		expect(searchResults.length).toBe(1);
		expect(searchResults[0].cfi).toBe("epubcfi(/6/26!/4/2/6,/1:5,/3:12)");
		expect(searchResults[0].excerpt).toBe('"Oh, I beg your pardon!" she exclaimed in a tone of great dismay.');
	});
});
