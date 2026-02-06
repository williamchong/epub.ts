import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";

const FIXTURES_DIR = path.resolve(__dirname, "fixtures");
const PORT_FILE = path.join(tmpdir(), "epub-ts-test-port");

const MIME_TYPES: Record<string, string> = {
	".opf": "text/xml",
	".xml": "text/xml",
	".xhtml": "application/xhtml+xml",
	".html": "text/html",
	".epub": "application/epub+zip",
	".css": "text/css",
	".js": "application/javascript",
	".json": "application/json",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".ncx": "text/xml",
};

let server: http.Server;

export async function setup() {
	return new Promise<void>((resolve, reject) => {
		server = http.createServer((req, res) => {
			const url = new URL(req.url || "/", "http://localhost");
			const filePath = path.join(FIXTURES_DIR, decodeURIComponent(url.pathname));

			if (!filePath.startsWith(FIXTURES_DIR)) {
				res.writeHead(403);
				res.end("Forbidden");
				return;
			}

			fs.readFile(filePath, (err, data) => {
				if (err) {
					res.writeHead(404);
					res.end("Not Found");
					return;
				}

				const ext = path.extname(filePath).toLowerCase();
				const contentType = MIME_TYPES[ext] || "application/octet-stream";
				res.writeHead(200, { "Content-Type": contentType });
				res.end(data);
			});
		});

		server.listen(0, "127.0.0.1", () => {
			const addr = server.address();
			if (typeof addr === "object" && addr) {
				writeFileSync(PORT_FILE, String(addr.port));
			}
			resolve();
		});

		server.on("error", reject);
	});
}

export async function teardown() {
	if (server) {
		return new Promise<void>((resolve) => {
			server.close(() => resolve());
		});
	}
}
