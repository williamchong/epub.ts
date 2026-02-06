/**
 * Inlined from marks-pane v1.0.9 (https://github.com/fchasen/marks)
 * SVG-based text annotation marks (highlights, underlines) for iframes.
 */

// -- SVG helpers --

function svgCreate(name) {
	return document.createElementNS("http://www.w3.org/2000/svg", name);
}

// -- Mouse event proxying --

function proxyMouse(target, tracked) {
	function dispatch(e) {
		for (var i = tracked.length - 1; i >= 0; i--) {
			var t = tracked[i];
			var x = e.clientX;
			var y = e.clientY;

			if (e.touches && e.touches.length) {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			}

			if (!hitTest(t, target, x, y)) {
				continue;
			}

			t.dispatchEvent(cloneEvent(e));
			break;
		}
	}

	var eventTarget;
	if (target.nodeName === "iframe" || target.nodeName === "IFRAME") {
		try {
			eventTarget = target.contentDocument;
		} catch (err) {
			eventTarget = target;
		}
	} else {
		eventTarget = target;
	}

	for (var ev of ["mouseup", "mousedown", "click", "touchstart"]) {
		eventTarget.addEventListener(ev, (e) => dispatch(e), false);
	}
}

function cloneEvent(e) {
	var opts = Object.assign({}, e, { bubbles: false });
	try {
		return new MouseEvent(e.type, opts);
	} catch (err) {
		var copy = document.createEvent("MouseEvents");
		copy.initMouseEvent(e.type, false, opts.cancelable, opts.view,
			opts.detail, opts.screenX, opts.screenY,
			opts.clientX, opts.clientY, opts.ctrlKey,
			opts.altKey, opts.shiftKey, opts.metaKey,
			opts.button, opts.relatedTarget);
		return copy;
	}
}

function hitTest(item, target, x, y) {
	var offset = target.getBoundingClientRect();

	function rectContains(r, x, y) {
		var top = r.top - offset.top;
		var left = r.left - offset.left;
		var bottom = top + r.height;
		var right = left + r.width;
		return (top <= y && left <= x && bottom > y && right > x);
	}

	var rect = item.getBoundingClientRect();
	if (!rectContains(rect, x, y)) {
		return false;
	}

	var rects = item.getClientRects();
	for (var i = 0, len = rects.length; i < len; i++) {
		if (rectContains(rects[i], x, y)) {
			return true;
		}
	}
	return false;
}

// -- Geometry helpers --

function coords(el, container) {
	var offset = container.getBoundingClientRect();
	var rect = el.getBoundingClientRect();

	return {
		top: rect.top - offset.top,
		left: rect.left - offset.left,
		height: el.scrollHeight,
		width: el.scrollWidth
	};
}

function setCoords(el, c) {
	el.style.setProperty("top", `${c.top}px`, "important");
	el.style.setProperty("left", `${c.left}px`, "important");
	el.style.setProperty("height", `${c.height}px`, "important");
	el.style.setProperty("width", `${c.width}px`, "important");
}

function containsRect(rect1, rect2) {
	return (
		(rect2.right <= rect1.right) &&
		(rect2.left >= rect1.left) &&
		(rect2.top >= rect1.top) &&
		(rect2.bottom <= rect1.bottom)
	);
}

// -- Classes --

export class Pane {
	constructor(target, container = document.body) {
		this.target = target;
		this.element = svgCreate("svg");
		this.marks = [];

		this.element.style.position = "absolute";
		this.element.setAttribute("pointer-events", "none");

		proxyMouse(this.target, this.marks);

		this.container = container;
		this.container.appendChild(this.element);

		this.render();
	}

	addMark(mark) {
		var g = svgCreate("g");
		this.element.appendChild(g);
		mark.bind(g, this.container);

		this.marks.push(mark);

		mark.render();
		return mark;
	}

	removeMark(mark) {
		var idx = this.marks.indexOf(mark);
		if (idx === -1) {
			return;
		}
		var el = mark.unbind();
		this.element.removeChild(el);
		this.marks.splice(idx, 1);
	}

	render() {
		setCoords(this.element, coords(this.target, this.container));
		for (var m of this.marks) {
			m.render();
		}
	}
}

export class Mark {
	constructor() {
		this.element = null;
	}

	bind(element, container) {
		this.element = element;
		this.container = container;
	}

	unbind() {
		var el = this.element;
		this.element = null;
		return el;
	}

	render() {}

	dispatchEvent(e) {
		if (!this.element) return;
		this.element.dispatchEvent(e);
	}

	getBoundingClientRect() {
		return this.element.getBoundingClientRect();
	}

	getClientRects() {
		var rects = [];
		var el = this.element.firstChild;
		while (el) {
			rects.push(el.getBoundingClientRect());
			el = el.nextSibling;
		}
		return rects;
	}

	filteredRanges() {
		var rects = Array.from(this.range.getClientRects());

		return rects.filter((box) => {
			for (var i = 0; i < rects.length; i++) {
				if (rects[i] === box) {
					return true;
				}
				if (containsRect(rects[i], box)) {
					return false;
				}
			}
			return true;
		});
	}
}

export class Highlight extends Mark {
	constructor(range, className, data, attributes) {
		super();
		this.range = range;
		this.className = className;
		this.data = data || {};
		this.attributes = attributes || {};
	}

	bind(element, container) {
		super.bind(element, container);

		for (var attr in this.data) {
			if (this.data.hasOwnProperty(attr)) {
				this.element.dataset[attr] = this.data[attr];
			}
		}

		for (var attr in this.attributes) {
			if (this.attributes.hasOwnProperty(attr)) {
				this.element.setAttribute(attr, this.attributes[attr]);
			}
		}

		if (this.className) {
			this.element.classList.add(this.className);
		}
	}

	render() {
		while (this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}

		var docFrag = this.element.ownerDocument.createDocumentFragment();
		var filtered = this.filteredRanges();
		var offset = this.element.getBoundingClientRect();
		var container = this.container.getBoundingClientRect();

		for (var i = 0, len = filtered.length; i < len; i++) {
			var r = filtered[i];
			var el = svgCreate("rect");
			el.setAttribute("x", r.left - offset.left + container.left);
			el.setAttribute("y", r.top - offset.top + container.top);
			el.setAttribute("height", r.height);
			el.setAttribute("width", r.width);
			docFrag.appendChild(el);
		}

		this.element.appendChild(docFrag);
	}
}

export class Underline extends Highlight {
	constructor(range, className, data, attributes) {
		super(range, className, data, attributes);
	}

	render() {
		while (this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}

		var docFrag = this.element.ownerDocument.createDocumentFragment();
		var filtered = this.filteredRanges();
		var offset = this.element.getBoundingClientRect();
		var container = this.container.getBoundingClientRect();

		for (var i = 0, len = filtered.length; i < len; i++) {
			var r = filtered[i];

			var rect = svgCreate("rect");
			rect.setAttribute("x", r.left - offset.left + container.left);
			rect.setAttribute("y", r.top - offset.top + container.top);
			rect.setAttribute("height", r.height);
			rect.setAttribute("width", r.width);
			rect.setAttribute("fill", "none");

			var line = svgCreate("line");
			line.setAttribute("x1", r.left - offset.left + container.left);
			line.setAttribute("x2", r.left - offset.left + container.left + r.width);
			line.setAttribute("y1", r.top - offset.top + container.top + r.height - 1);
			line.setAttribute("y2", r.top - offset.top + container.top + r.height - 1);

			line.setAttribute("stroke-width", 1);
			line.setAttribute("stroke", "black");
			line.setAttribute("stroke-linecap", "square");

			docFrag.appendChild(rect);
			docFrag.appendChild(line);
		}

		this.element.appendChild(docFrag);
	}
}
