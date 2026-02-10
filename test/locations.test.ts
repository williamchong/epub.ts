import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import Locations from "../src/locations";
import * as core from "../src/utils/core";

const fixturesDir = path.resolve(__dirname, "fixtures");

describe("Locations", () => {

	describe("#parse", () => {
		var chapter = fs.readFileSync(path.join(fixturesDir, "locations.xhtml"), "utf8");

		it("parse locations from a document", () => {
			var doc = core.parse(chapter, "application/xhtml+xml");
			var contents = doc.documentElement;
			var locations = new Locations();
			var result = locations.parse(contents, "/6/4[chap01ref]", 100);
			expect(result.length).toBe(15);
		});

	});

});
