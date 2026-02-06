import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.js"),
			name: "ePub",
			formats: ["es", "umd"],
			fileName: (format) => format === "es" ? "epub.js" : "epub.umd.js",
		},
		rollupOptions: {
			external: ["jszip"],
			output: {
				globals: { jszip: "JSZip" },
				exports: "named",
			},
		},
		sourcemap: true,
	},
});
