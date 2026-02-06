import http from "node:http";
import https from "node:https";
import { URL as NodeURL } from "node:url";

// Polyfill URL.createObjectURL / revokeObjectURL for jsdom
if (typeof URL.createObjectURL === "undefined") {
	let counter = 0;
	URL.createObjectURL = (_blob: Blob) => `blob:http://localhost/${++counter}`;
	URL.revokeObjectURL = (_url: string) => {};
}

// Polyfill XMLHttpRequest for jsdom — jsdom's built-in XHR doesn't make real HTTP requests in vitest.
// This minimal implementation covers what epub.ts's request.ts needs.
class NodeXHR {
	readyState = 0;
	status = 0;
	statusText = "";
	response: any = null;
	responseText = "";
	responseXML: Document | null = null;
	responseType: XMLHttpRequestResponseType = "";
	onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
	onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null = null;

	private _method = "GET";
	private _url = "";
	private _async = true;
	private _headers: Record<string, string> = {};
	private _mimeOverride: string | null = null;

	static readonly UNSENT = 0;
	static readonly OPENED = 1;
	static readonly HEADERS_RECEIVED = 2;
	static readonly LOADING = 3;
	static readonly DONE = 4;
	readonly UNSENT = 0;
	readonly OPENED = 1;
	readonly HEADERS_RECEIVED = 2;
	readonly LOADING = 3;
	readonly DONE = 4;

	open(method: string, url: string, async = true) {
		this._method = method;
		this._url = url;
		this._async = async;
		this.readyState = 1;
		this._fireReadyStateChange();
	}

	setRequestHeader(name: string, value: string) {
		this._headers[name] = value;
	}

	overrideMimeType(mime: string) {
		this._mimeOverride = mime;
	}

	send(_body?: any) {
		const parsed = new NodeURL(this._url);
		const transport = parsed.protocol === "https:" ? https : http;

		const req = transport.request(this._url, {
			method: this._method,
			headers: this._headers,
		}, (res) => {
			this.status = res.statusCode || 0;
			this.statusText = res.statusMessage || "";

			const chunks: Buffer[] = [];
			res.on("data", (chunk: Buffer) => chunks.push(chunk));
			res.on("end", () => {
				const buffer = Buffer.concat(chunks);

				if (this.responseType === "arraybuffer") {
					// Copy into a fresh ArrayBuffer — Node's Buffer.buffer
					// may be a shared slab that JSZip doesn't recognize.
					const ab = new ArrayBuffer(buffer.byteLength);
					new Uint8Array(ab).set(buffer);
					this.response = ab;
				} else if (this.responseType === "blob") {
					this.response = new Blob([buffer]);
				} else {
					const text = buffer.toString("utf-8");
					this.responseText = text;
					this.response = text;

					// Parse XML if the MIME type suggests it
					const contentType = res.headers["content-type"] || "";
					const mimeForParse = this._mimeOverride || contentType;
					if (
						mimeForParse.includes("xml") ||
						mimeForParse.includes("xhtml") ||
						mimeForParse.includes("html")
					) {
						try {
							const parser = new DOMParser();
							const mime = mimeForParse.includes("html")
								? "text/html"
								: "text/xml";
							this.responseXML = parser.parseFromString(text, mime as DOMParserSupportedType);
						} catch {
							// ignore parse errors
						}
					}
				}

				this.readyState = 4;
				this._fireReadyStateChange();
			});
		});

		req.on("error", () => {
			this.readyState = 4;
			this.status = 0;
			if (this.onerror) {
				this.onerror.call(this as any, new ProgressEvent("error"));
			}
			this._fireReadyStateChange();
		});

		req.end();
	}

	abort() {}
	getAllResponseHeaders() { return ""; }
	getResponseHeader(_name: string) { return null; }

	private _fireReadyStateChange() {
		if (this.onreadystatechange) {
			this.onreadystatechange.call(this as any, new Event("readystatechange"));
		}
	}
}

// Replace jsdom's non-functional XMLHttpRequest
(globalThis as any).XMLHttpRequest = NodeXHR;
